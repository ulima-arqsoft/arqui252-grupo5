import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import CircuitBreaker from "opossum";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Función base: llamada real a Stripe
async function createPaymentIntent(amount) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent;
}

// Configuración del circuito
const breakerOptions = {
  timeout: 5000,               // 5s para que Stripe responda
  errorThresholdPercentage: 50, // si 50% fallan, se abre
  resetTimeout: 10000,         // intenta cerrarse después de 10s
};

// Crear el breaker
const stripeBreaker = new CircuitBreaker(createPaymentIntent, breakerOptions);

// Definir fallback
stripeBreaker.fallback((amount) => {
  console.warn("Fallback ejecutado - Stripe no disponible");
  return {
    client_secret: "fake_secret_simulado",
    fallback: true,
  };
});

// Logs útiles
stripeBreaker.on("open", () => console.warn("⚠️ Circuito ABIERTO - Stripe no responde"));
stripeBreaker.on("halfOpen", () => console.log("🟡 Circuito medio abierto: probando reconexión"));
stripeBreaker.on("close", () => console.log("✅ Circuito CERRADO - Stripe recuperado"));
stripeBreaker.on("fallback", () => console.log("⚙️ Ejecutando respuesta fallback"));

// Endpoint principal
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripeBreaker.fire(amount);

    // Si es fallback, informamos al cliente
    if (paymentIntent.fallback) {
      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        fallback: true,
        message: "Servicio Stripe en modo simulado.",
      });
    }

    // Si fue exitoso
    res.json({
      clientSecret: paymentIntent.client_secret,
      fallback: false,
    });

  } catch (error) {
    console.error("Error o circuito abierto:", error.message);
    res.status(503).json({
      error: "Servicio de pagos temporalmente no disponible. Intente más tarde.",
    });
  }
});

app.listen(3000, () => console.log("Backend corriendo en puerto 3000"));
