import { Art } from "../art/art.model";
import { User } from "../user/user.model";

export interface SavedArt {
    id: string;
    art: Art;
    user: User;
    map: number[][];
    lastModified: Date;
}
