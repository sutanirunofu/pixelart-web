import { User } from "../../user/user.model";

export interface AccessTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginSuccessRTO {
    user: User;
    tokens: AccessTokens;
}
