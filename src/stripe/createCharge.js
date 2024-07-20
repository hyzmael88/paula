// src/stripe/createCharge.js
const stripe = require('./stripeConfig');

async function createCharge({ paquete }) {
    const { nombre, precio, portadas, descripcion } = paquete;
  try {
    const charge = await stripe.charges.create({
      amount: precio * 100,
      currency: 'mxn',
      source: portadas[0] ,
      description:descripcion ,
    });
    return charge;
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
}

module.exports = { createCharge };