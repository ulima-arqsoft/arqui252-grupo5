// src/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const breaker = require('./stripeService');

app.use(express.json());

// Ruta de prueba de pago
app.post('/pay', async (req, res) => {
  const { amount } = req.body;
  try {
    const result = await breaker.fire(amount);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ruta para ver el estado del disyuntor
app.get('/breaker-status', (req, res) => {
  res.json({
    state: breaker.opened ? 'OPEN' : 'CLOSED',
    stats: breaker.stats,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
