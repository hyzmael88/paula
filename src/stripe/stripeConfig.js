// src/stripe/stripeConfig.js
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

module.exports = stripe;