import { useEffect, useState } from "react";
import { PayloadSignature } from "../type";
import { ApiError } from "../utils/ApiError";

const secretKey = import.meta.env.VITE_UPG_SECRET_KEY;

async function generateSignature(payload: PayloadSignature): Promise<string> {
    if (!secretKey) {
        throw new ApiError("VITE_UPG_SECRET_KEY is not configured", 0);
    }

    const concatenatedValues = Object.keys(payload)
        .sort()
        .map((key) => String(payload[key as keyof PayloadSignature] ?? ""))
        .join("")
        .replace(/\s/g, "");
    console.log("concateValue:", concatenatedValues);
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secretKey),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(concatenatedValues),
    );

    return Array.from(new Uint8Array(signature), (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("");
}

export const useGenerateSignature = (payload: PayloadSignature) => {
    const [signature, setSignature] = useState<string | null>(null);
    const [generating, setGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (payload.paymentMethod && payload.amount > 0) {
            const generate = async () => {
                setGenerating(true);
                setError(null);
                setSignature(null);
                try {
                    const result = await generateSignature(payload);
                    if (!cancelled) setSignature(result)
                } catch (error: unknown) {
                    if (!cancelled) {
                        setError(error instanceof ApiError ? error.message : "Unable to generate signature");
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
        setSignature(null);
        setGenerating(false);
    }, [payload.paymentMethod, payload.amount])

    return { signature, generating, error }
}