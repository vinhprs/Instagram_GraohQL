import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUserIdFromRequest } from '../../utils/jwt.utils';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>
  ) {}

  async likePost(postId: string, req: Request) 
  : Promise<Like> {
    const userId: string = getUserIdFromRequest(req);

    const like = this.likesRepository.create({postId});
    like.userId = userId;

    return await this.likesRepository.save(like);
  }

  async unlikePost(postId: string, req: Request) 
  : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);

    return await this.likesRepository.delete({
      userId,
      postId
    }) ? true: false;
  }

  async likeComment(commentId: string, req: Request)
  : Promise<Like> {
    const userId: string = getUserIdFromRequest(req);

    const like = this.likesRepository.create({commentId});
    like.userId = userId;

    return await this.likesRepository.save(like);
  }

  async getLikeByPost(postId: string){
    const condition = {
      postId
    }
    const [likes, count] = await Promise.all([
      this.likesRepository.find({
        where: condition
      }),
      this.likesRepository.count({
        where: condition
      })
    ])
    return count;
  }
 
}
