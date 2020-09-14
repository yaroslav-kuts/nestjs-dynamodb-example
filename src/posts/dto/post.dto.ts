import { PostInputDto} from './post-input.dto';

export class PostDto extends PostInputDto {
  id: string;
  addedAt: number;
}
