// src/stripeService.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CircuitBreaker = require('opossum');

// --- Función principal para crear PaymentIntent ---
async function createPaymentIntent(amount) {
  // Simula una llamada real a Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  return paymentIntent;
}

// --- Configuración del disyuntor ---
const options = {
  timeout: 5000,          // tiempo máximo para esperar respuesta
  errorThresholdPercentage: 50, // abre el circuito si 50% de llamadas fallan
  resetTimeout: 10000,    // reintenta después de 10s
};

const breaker = new CircuitBreaker(createPaymentIntent, options);

// --- Fallback cuando Stripe falla ---
breaker.fallback(() => ({
  status: 'fallback',
  message: 'El servicio de pagos no está disponible temporalmente. Intenta más tarde.',
}));

// Exportar disyuntor
module.exports = breaker;
