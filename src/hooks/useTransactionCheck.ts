import { useEffect, useState } from "react";
import { ApiError } from "../utils/ApiError";
import { TransactionStatusData, UseTransactionCheckResult } from "../type";

const fetchTransactionStatus = async (
    txnId: string,
    signal: AbortSignal
): Promise<TransactionStatusData> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/transaction/status/${txnId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                signal,
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message =
                result?.message || result?.msg || `Request failed with status ${response.status}`;
            throw new ApiError(message, response.status);
        }

        return {
            ...result.data,
            message: result.message,
        };
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new ApiError("Request timed out", 0);
        }
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("Network error - check your connection", 0);
    } finally {
        clearTimeout(timeoutId);
    }
};

export const useTransactionCheck = (
    txnId: string | null
): UseTransactionCheckResult => {
    const [data, setData] = useState<TransactionStatusData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!txnId) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchTransactionStatus(txnId, controller.signal);
                if (!cancelled) {
                    setData(result);
                }
            } catch (error: unknown) {
                if (!cancelled) {
                    setError(error instanceof ApiError ? error.message : "Unknown error occured");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [txnId]);

    return { data, loading, error };
};
