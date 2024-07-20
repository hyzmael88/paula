// src/stripe/createCharge.js
const stripe = require('./stripeConfig');

async function createCharge({ amount, source, currency = 'usd', description = '' }) {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description,
    });
    return charge;
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
}

module.exports = { createCharge };