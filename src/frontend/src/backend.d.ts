import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    network: string;
    timestamp: bigint;
    phoneNumber: string;
    price: string;
    bundle: string;
}
export interface ShoppingItem {
    currency: string;
    productName: string;
    productDescription: string;
    priceInCents: bigint;
    quantity: bigint;
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    placeOrder(network: string, bundle: string, price: string, phoneNumber: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    _initializeAccessControlWithSecret(adminToken: string): Promise<void>;
}
