import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    private platformId = inject(PLATFORM_ID);

    public get(key: string): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return window.localStorage.getItem(key);
        }

        return null;
    }

    public set(key: string, value: string): void {
        if (isPlatformBrowser(this.platformId)) {
            window.localStorage.setItem(key, value);
        }
    }

    public remove(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            window.localStorage.removeItem(key);
        }
    }
}
