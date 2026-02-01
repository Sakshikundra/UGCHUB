'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EscrowPaymentButton({ gigId, amount, gigTitle }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
       // 1. Create Order
       const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId }),
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "UGCHub Escrow",
        description: `Escrow deposit for: ${gigTitle}`,
        order_id: orderData.orderId,
        handler: async function (response) {
            try {
               // 3. Verify Payment
               const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  gigId: gigId
                }),
              });
              
              if (!verifyRes.ok) throw new Error('Verification failed');
              
              // Success! Refresh page to show updated status
              router.refresh(); 

            } catch (err) {
               console.error("Verification Error", err);
               alert("Payment verification failed. Please contact support.");
            }
        },
        theme: {
          color: "#9333ea", // Purple-600
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (error) {
      console.error("Payment Start Error", error);
      alert(error.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button 
        onClick={handlePayment} 
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
      >
        {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <Lock className="mr-2 h-4 w-4" />
        )}
        Secure Escrow Deposit (₹{amount})
      </Button>
      <div className="text-center mt-2">
         <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Funds held securely until job completion
         </p>
      </div>
    </>
  );
}
