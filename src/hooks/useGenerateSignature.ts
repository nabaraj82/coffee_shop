import { useEffect, useState } from "react";
import { PayloadSignature } from "../type";
import { ApiError } from "../utils/ApiError";

async function generateSignature(payload: PayloadSignature, abort: boolean): Promise<string> {
    const controller = new AbortController();
    if (abort) {
        controller.abort();
    }
    let timer;
    if (!abort) {
         timer = setTimeout(() => controller.abort(), 8000);
    }
    try {
        const response = await fetch("http://10.14.151.13:9090/api/upg/generate-signature", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });
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
            return result.data.signature;
        } catch {
            throw new ApiError('Invalid response format', response.status);
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError('Request time out', 0);
        }
        if (error instanceof ApiError) throw error;
        throw new ApiError('Network error - check your connection', 0);
    } finally {
        clearTimeout(timer)
    }
}

export const useGenerateSignature = (payload: PayloadSignature) => {
    const [signature, setSignature] = useState<string | null>(null);
    const [generating, setGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (payload.paymentMethod) {
            const generate = async () => {
                setGenerating(true);
                setError(null);
                try {
                    const result = await generateSignature(payload, cancelled);
                    if(!cancelled) setSignature(result)
                } catch (error: unknown) {
                    if (!cancelled) {
                        setError(error instanceof ApiError ? error.message : "Unknown error occured");
                    }
                } finally {
                    if (!cancelled) setGenerating(false);
                }
            }
            generate();
            return () => {
                cancelled = true;
            }
        }
    }, [payload.paymentMethod])

    return {signature, generating, error}
}