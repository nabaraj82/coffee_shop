import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Hero from "./components/hero/Hero";
import { useTransactionCheck } from "./hooks/useTransactionCheck";

type TransactionStatus = {
  state: "success" | "failure";
  title: string;
  message: string;
};

const App = () => {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const txnId = params.get("txnId");
  const { data, loading, error } = useTransactionCheck(txnId);

  useEffect(() => {
    if (!txnId || loading) {
      return;
    }

    if (error) {
      setStatus({
        state: "failure",
        title: "Transaction Check Error",
        message: error,
      });
      setStatusDialogOpen(true);
      return;
    }

    if (!data) {
      return;
    }

    const transactionStatus = String(
      data.transactionStatus || "",
    ).toLowerCase();
    const isSuccess = ["success", "paid", "completed", "ok"].includes(
      transactionStatus,
    );

    setStatus({
      state: isSuccess ? "success" : "failure",
      title: isSuccess ? "Transaction Successful" : "Transaction Failed",
      message:
        data.message ||
        `Transaction ${txnId} ${isSuccess ? "completed successfully." : "could not be verified."}`,
    });
    setStatusDialogOpen(true);
  }, [data, error, loading, txnId]);

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <ToastContainer />

      <AnimatePresence>
        {statusDialogOpen && status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
            >
              <div className="mb-5 rounded-[1.5rem] bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-lightOrange">
                  Transaction Status
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {status.state === "success" ? (
                    <FaCheckCircle className="h-8 w-8 text-emerald-400" />
                  ) : (
                    <FaTimesCircle className="h-8 w-8 text-rose-400" />
                  )}
                  <h2 className="text-3xl font-bold">{status.title}</h2>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-700">{status.message}</p>
                {data && (
                  <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Payment Method
                      </p>
                      <p className="mt-1 font-medium">
                        {data.paymentMethod ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Amount
                      </p>
                      <p className="mt-1 font-medium">
                        Rs {data.totalAmount ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Order ID
                      </p>
                      <p className="mt-1 font-medium">
                        {data.orderId ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Merchant Txn ID
                      </p>
                      <p className="mt-1 font-medium">
                        {data.merchantTxnId ?? "N/A"}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setStatusDialogOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
