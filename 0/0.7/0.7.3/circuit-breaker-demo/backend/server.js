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

// 👉 Función base: llamada a Stripe
async function createPaymentIntent(amount) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
  });
  return paymentIntent;
}

// 👉 Configuración del circuito
const breakerOptions = {
  timeout: 5000,              // tiempo máximo antes de que se considere fallo (5s)
  errorThresholdPercentage: 50, // si el 50% de las llamadas fallan, se abre el circuito
  resetTimeout: 10000,        // intenta "cerrarse" después de 10s
};

// 👉 Crear el breaker sobre la función de Stripe
const stripeBreaker = new CircuitBreaker(createPaymentIntent, breakerOptions);

// 👉 Listener opcional para logs
stripeBreaker.on("open", () => console.warn("⚠️ Circuito ABIERTO - Stripe no responde"));
stripeBreaker.on("halfOpen", () => console.log("🟡 Circuito medio abierto: probando reconexión"));
stripeBreaker.on("close", () => console.log("✅ Circuito CERRADO - Stripe recuperado"));
stripeBreaker.on("fallback", () => console.log("⚙️ Ejecutando respuesta fallback"));

// 👉 Endpoint con breaker
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    // usa el breaker en lugar de llamar a Stripe directamente
    const paymentIntent = await stripeBreaker.fire(amount);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Error o circuito abierto:", error.message);
    // respuesta controlada si Stripe está caído o el breaker está abierto
    res.status(503).json({
      error: "Servicio de pagos temporalmente no disponible. Intente más tarde.",
    });
  }
});

app.listen(3000, () => console.log("🚀 Backend corriendo en puerto 3000"));
