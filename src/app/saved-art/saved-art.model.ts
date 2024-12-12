import { Art } from '../art/art.model';
import { User } from '../user/user.model';

export interface SavedArt {
  art: Art;
  user: User;
  map: number[][];
  lastModified: Date;
}
