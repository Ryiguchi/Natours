import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51MxxFoCyE3KlvgqvKGO9m3AGRmxIkBqFh1nLOX9v8ec1KDNNuL1sdkmQPClFUF0HElHky0vaormgDixvP4MCOVyL00gUtsQ6In'
  );

  try {
    // 1) get session from API
    const res = await fetch(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    const session = await res.json();
    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', err.message);
  }
};
