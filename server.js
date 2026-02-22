require('dotenv').config();
const express = require('express');
const path    = require('path');
const Stripe  = require('stripe');
const admin   = require('firebase-admin');

const app    = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* ── Firebase Admin ─────────────────────────────────────────── */
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

/* ── Stripe Webhook ─────────────────────────────────────────── */
// Must be registered BEFORE express.json() — needs the raw request body
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid     = session.client_reference_id;
    if (uid) {
      await db.collection('users').doc(uid).set({ paid: true }, { merge: true });
      console.log(`Access granted to uid: ${uid}`);
    }
  }

  res.json({ received: true });
});

/* ── JSON middleware (for all other routes) ─────────────────── */
app.use(express.json());

/* ── Create Stripe Checkout Session ────────────────────────── */
app.post('/create-checkout', async (req, res) => {
  const { uid, email } = req.body;
  if (!uid) return res.status(400).json({ error: 'Missing uid' });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency:     'usd',
          product_data: { name: 'Full Course Access' },
          unit_amount:  2990  // $29.90
        },
        quantity: 1
      }],
      mode:                 'payment',
      client_reference_id:  uid,
      customer_email:       email || undefined,
      success_url:          `${process.env.APP_URL}?payment=success`,
      cancel_url:           process.env.APP_URL
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── Serve Static Files ─────────────────────────────────────── */
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ── Start ──────────────────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
