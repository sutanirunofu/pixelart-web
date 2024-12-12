import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "arts",
        loadComponent: () => import("./art/art-page.component").then((m) => m.ArtPageComponent),
    },
    {
        path: "user",
        loadComponent: () => import("./user/user-page.component").then((m) => m.UserPageComponent),
    },
    {
        path: "saved-arts",
        loadComponent: () => import("./saved-art/saved-art-page.component").then((m) => m.SavedArtPageComponent),
    },
    {
        path: "login",
        loadComponent: () => import("./auth/login/login-page.component").then((m) => m.LoginPageComponent),
    },
    {
        path: "signup",
        loadComponent: () => import("./auth/signup/signup-page.component").then((m) => m.SignupPageComponent),
    },
    {
        path: "**",
        redirectTo: "arts",
        pathMatch: "full",
    },
];
