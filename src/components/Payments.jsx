import PropTypes from 'prop-types'; 
import { useEffect, useState } from 'react';
import axios from 'axios'

const Payment = ({ amount = 500, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order
      const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, { amount });

      if (!orderResponse.data || !orderResponse.data.order || !orderResponse.data.order.id) {
        throw new Error('Invalid order response from server');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // Securely load key
        amount: orderResponse.data.order.amount,
        currency: "INR",
        name: "VitaminJob",
        description: "Course Purchase",
        order_id: orderResponse.data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              alert('Payment successful!');
              if (onSuccess) onSuccess(response);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            setError('Payment verification failed');
            console.error('Verification error:', err);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to initiate payment';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-5">
      <button 
        onClick={handlePayment}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${
          loading 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

Payment.propTypes = {
  amount: PropTypes.number,
  onSuccess: PropTypes.func
};

export default Payment;
