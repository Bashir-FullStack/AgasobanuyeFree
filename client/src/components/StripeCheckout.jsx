import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { API } from "../config";

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "system-ui, sans-serif",
      color: "#1f2937",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const StripeCheckout = forwardRef(({ amount, customer, onSuccess, onError }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!amount || amount <= 0) return;
    setCardError("");
    setClientSecret(null);
    fetch(`${API}/payment/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "usd", customer }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setCardError(data.error || "Failed to initialize payment");
      })
      .catch(() => setCardError("Payment service unavailable"));
  }, [amount]);

  useImperativeHandle(ref, () => ({
    confirmPayment: async () => {
      if (!stripe || !elements || !clientSecret) {
        onError?.("Payment not initialized");
        return null;
      }
      setProcessing(true);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      setProcessing(false);
      if (error) {
        onError?.(error.message);
        return null;
      }
      if (paymentIntent.status === "succeeded") {
        onSuccess?.(paymentIntent.id);
        return paymentIntent.id;
      }
      onError?.("Payment failed");
      return null;
    },
    processing,
  }));

  return (
    <div className="space-y-2">
      <div className={`border rounded-lg p-3 transition ${cardError ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
        <CardElement options={CARD_OPTIONS} />
      </div>
      {cardError && <p className="text-xs text-red-500">{cardError}</p>}
      {!clientSecret && !cardError && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Initializing secure payment...
        </p>
      )}
    </div>
  );
});

StripeCheckout.displayName = "StripeCheckout";
export default StripeCheckout;
