import { Routes } from "@angular/router";

import { authGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [
    {
        path: "arts",
        loadComponent: () => import("./art/art-page.component").then((m) => m.ArtPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "arts/:id",
        loadComponent: () => import("./art/art-item/art-item-page.component").then((m) => m.ArtItemPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "user",
        loadComponent: () => import("./user/user-page.component").then((m) => m.UserPageComponent),
        canActivate: [authGuard],
    },
    {
        path: "saved-arts",
        loadComponent: () => import("./saved-art/saved-art-page.component").then((m) => m.SavedArtPageComponent),
        canActivate: [authGuard],
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
