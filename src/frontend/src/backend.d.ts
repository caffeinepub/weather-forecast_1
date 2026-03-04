import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Record_ {
    latitude: number;
    city: string;
    longitude: number;
    inCelsius: boolean;
}
export interface backendInterface {
    getAllPreferences(): Promise<Array<Record_>>;
    getPreferences(): Promise<Record_>;
    savePreferences(city: string, latitude: number, longitude: number, inCelsius: boolean): Promise<void>;
}
