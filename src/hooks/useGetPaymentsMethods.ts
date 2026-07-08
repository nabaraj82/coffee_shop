import { useEffect, useState } from "react";
import { PaymentsMethod, UseGetPaymentMethodsResult } from "../type";
import { ApiError } from "../utils/ApiError";



    const fetchPaymentMethods = async (): Promise<PaymentsMethod[]> => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
    try {
        const response = await fetch("http://10.14.151.13:9090/api/upg/payment-methods", {signal: controller.signal});
        if (!response.ok) {
            let message = `Request failed with status ${response.status}`;
            try {
                const errBody = await response.json();
                message = errBody.message || message;
            } catch (error) {
                
            }
            throw new ApiError(message, response.status);
        }
        try {
            const result = await response.json();
            return result.data;
        } catch {
            throw new ApiError('Invalid response format', response.status)
        }
    } catch (error: unknown ) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            
        }
        if (error instanceof ApiError) throw error;
        throw new ApiError('Network error - check your connection', 0);
    } finally {
        clearTimeout(timer)
    }
}  

export const useGetPaymentsMethods = (): UseGetPaymentMethodsResult => {

    const [data, setData] = useState<PaymentsMethod[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchPaymentMethods();
                if (!cancelled) setData(result);
            } catch (error: unknown) {
                if (!cancelled) {
                    setError(error instanceof ApiError ? error.message : "Unknown error occured");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        }
    }, []);

    return {data, loading, error}

}