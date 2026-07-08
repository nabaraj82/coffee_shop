
export interface PaymentsMethod {
    valueToSend: string;
    valueToShow: string;
    numberOfOptions: number;
}

export interface UseGetPaymentMethodsResult {
    data: PaymentsMethod[] | null;
    loading: boolean;
    error: string | null;
}

export interface PayloadSignature {
    merchantId: string,
    orderId: string,
    merchantName: string,
    amount: number,
    paymentMethod: string | null,
    description: string,
    merchantCustomerName: string,
    merchantCustomerPhoneNumber: string,
}

export interface PayloadRedirectToUPG extends PayloadSignature {
    signature: string;
}
export interface UseRedirectToUPGResult {
    redirect: () => void;
    redirecting: boolean;
    error: string | null;
}