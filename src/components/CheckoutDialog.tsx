import { motion, AnimatePresence } from "framer-motion";

import Coffee3 from "../assets/coffee/coffee3.png";

import React, { useEffect, useState } from "react";
import { useGetPaymentsMethods } from "../hooks/useGetPaymentsMethods";
import { useGenerateSignature } from "../hooks/useGenerateSignature";
import { useRedirectToUPG } from "../hooks/useRedirectToUPG";
import { toast } from "react-toastify";

function CheckoutDialog({
  checkoutOpen,
  setCheckoutOpen,
}: {
  checkoutOpen: boolean;
  setCheckoutOpen: (value: boolean) => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const { data: paymentMethods, loading, error } = useGetPaymentsMethods();

  const {
    signature,
    generating,
    error: signatureError,
  } = useGenerateSignature({
    merchantId: "12",
    orderId: "BLN-01",
    merchantName: "Test Company",
    amount: 310,
    paymentMethod,
    description: "Payment for order #123",
    merchantCustomerName: "Dummy user",
    merchantCustomerPhoneNumber: "9800000000",
  });

  const {
    redirect,
    redirecting,
    error: redirectError,
  } = useRedirectToUPG(
    {
      merchantId: "12",
      orderId: "BLN-01",
      merchantName: "Test Company",
      amount: 310,
      paymentMethod,
      description: "Payment for order #123",
      merchantCustomerName: "Dummy user",
      merchantCustomerPhoneNumber: "9800000000",
    },
    signature,
  );

  useEffect(() => {
    if (paymentMethod) {
    }
  }, [paymentMethod]);

  if (error) {
    toast(error);
  }

  if (signatureError) {
    toast(signatureError);
  }
  if (redirectError) {
    toast(redirectError);
  }

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
          >
            <div className="mb-5 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-5">
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.3em] text-lightOrange">
                  Checkout
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Confirm your order
                </h2>
              </div>
              <div className="flex flex-col gap-5 rounded-3xl border border-lightOrange/30 bg-slate-700 px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">Order total</p>
                  <p className="mt-2 text-2xl font-semibold text-lightOrange">
                    Rs 310
                  </p>
                </div>
                <div className="relative mx-auto md:mx-0">
                  <img
                    src={Coffee3}
                    alt="Coffee product"
                    className="relative z-10 h-40 w-40 rounded-[1.5rem] object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Choose payment method
                </h3>
                {loading && <p>Please wait!</p>}
                {error && !loading ? (
                  <p className="text-sm text-rose-500">{error}</p>
                ) : paymentMethods && paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((option) => (
                      <label
                        key={option.valueToSend}
                        className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition hover:border-primary"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={option.valueToSend}
                          checked={paymentMethod === option.valueToSend}
                          onChange={() => setPaymentMethod(option.valueToSend)}
                        />
                        <span>{option.valueToShow}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-rose-500">
                    Payment methods are unavailable. Please try again later.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={redirect}
                  disabled={!paymentMethod}
                  className="flex-1 rounded-full bg-gradient-to-r from-primary to-primaryDark px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {redirecting ? "Redirecting" : " Confirm Payment"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CheckoutDialog;
