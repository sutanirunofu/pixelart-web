export interface Pixel {
    num: number;
    color: string;
    textColor: string;
    painted?: {
        num: number;
        color: string;
        isCorrect: boolean;
    };
}
