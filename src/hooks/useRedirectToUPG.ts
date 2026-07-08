import { useCallback, useEffect, useState } from "react";
import { PayloadRedirectToUPG, PayloadSignature, UseRedirectToUPGResult } from "../type";



export const useRedirectToUPG = (
    payload: PayloadSignature,
    signature: string | null,
): UseRedirectToUPGResult => {

    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setRedirecting(false);
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setRedirecting(false);
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    const redirect = useCallback(() => {
        setError(null);
        const fullPayload: PayloadRedirectToUPG = { ...payload, signature: signature ?? "" };
        const missingFields = Object.entries(fullPayload).filter(
            ([, value]) => value === undefined || value === null || value === ""
        );
        if (missingFields.length > 0) {
            setError(
                `Missing required fields: ${missingFields.map(([k]) => k).join(", ")}`
            );
            return;
        }
        if (!signature) {
            setError("Signature is required before redirecting.");
            return;
        }
        setRedirecting(true);
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "http://10.14.151.13:9090/api/upg/checkout";
        form.enctype = "application/x-www-form-urlencoded";
        form.target = "_self";
        form.style.display = "none";

        (Object.keys(fullPayload) as (keyof PayloadRedirectToUPG)[]).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(fullPayload[key] ?? "");
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }, [payload, signature]);

    return { redirect, redirecting, error }
}