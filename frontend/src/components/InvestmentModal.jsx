import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InvestmentModal = ({ bond, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handlePayment = async () => {
    if (amount < 1000) {
      setError("Minimum investment is ₹1,000");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      
      const order = await orderRes.json();
      
      if (!order || order.error) {
        throw new Error(order.error || "Failed to create order");
      }

      // Fetch Razorpay Key dynamically so you don't have to hardcode it
      const configRes = await fetch("/api/config/razorpay");
      const config = await configRes.json();

      // 2. Setup Razorpay Options
      const options = {
        key: config.key_id, 
        amount: order.amount,
        currency: order.currency,
        name: "Green Bond Impact",
        description: `Investment in ${bond.name}`,
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=leaf&backgroundColor=00FF88",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bondId: bond.id,
                amount: amount,
                investorId: "user_123" // Replace with actual user ID from Clerk/Auth
              }),
            });
            
            const result = await verifyRes.json();
            
            if (result.success) {
              onSuccess(result.transaction);
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            setError("Error verifying payment.");
          }
        },
        prefill: {
          name: "Test Investor",
          email: "investor@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#00FF88"
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
        setIsLoading(false);
      });
      
      rzp.open();

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedCO2 = ((amount / 1000) * 0.5).toFixed(1);
  const estimatedTrees = Math.floor((amount / 1000) * 5);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-forest/90 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-neonEmerald/20 blur-[60px] pointer-events-none rounded-full" />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-mint/50 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-sage/20 text-neonEmerald text-xs font-bold tracking-widest uppercase mb-4">Secure Checkout</span>
            <h2 className="text-3xl font-serif text-cream leading-tight">Invest in <br/><span className="text-mint">{bond.name}</span></h2>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-mint/70 mb-2">Investment Amount (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-mint/50 font-medium">₹</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={handleAmountChange}
                  min="1000"
                  step="1000"
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold text-white focus:outline-none focus:border-neonEmerald focus:ring-1 focus:ring-neonEmerald transition-all"
                />
              </div>
              <p className="text-xs text-mint/50 mt-2 flex justify-between">
                <span>Min: ₹1,000</span>
                <span>Max: ₹500,000</span>
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <h4 className="text-sm text-cream font-bold mb-3">Estimated Impact Generated</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-mint/70 text-sm">CO2 Avoided</span>
                <span className="text-neonEmerald font-bold">{estimatedCO2} Tons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mint/70 text-sm">Equivalent Trees</span>
                <span className="text-[#4ade80] font-bold">{estimatedTrees} Trees</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-neonEmerald to-sage text-forest font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Pay ₹{amount.toLocaleString()}
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-mint/40 uppercase tracking-widest mt-4">Secured by Razorpay</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvestmentModal;
