/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51K0i6JSFWRmEvGUopE2hkX5nsrkPQX7GdHtahVNhEfQmJXNk0kdLxgQUFkqkQCdthAIu4CxWY7TolvE8IEpaoPHN003EZghbOa"
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    // console.log(error);
    showAlert("error", err);
  }
};
