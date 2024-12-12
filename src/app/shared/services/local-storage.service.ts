import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    constructor() {}

    public get(key: string): string | null {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(key);
        }

        return null;
    }

    public set(key: string, value: string): void {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, value);
        }
    }

    public delete(key: string): void {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
        }
    }
}
