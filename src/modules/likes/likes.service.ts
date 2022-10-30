import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getUserIdFromRequest } from '../../utils/jwt.utils';
import { likeResult } from '../common/entities/common.entity';
import { User } from '../users/entity/users.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>
  ) {}

  async likePost(postId: string, req: Request) 
  : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);

    const liked = await this.likesRepository.findOne({
      where: {userId, postId}
    })

    if(liked) {
      return await this.unlikePost(postId, req);
    }

    const like = this.likesRepository.create({postId});
    like.userId = userId;

    return await this.likesRepository.save(like) ? true: false;
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

  async getLikeByPost(postId: string): Promise<likeResult> {
    const condition = {
      postId
    }
    const [likes, count] = await Promise.all([
      this.likesRepository.find({
        where: condition,
        relations: {user: true},
      }),
      this.likesRepository.count({
        where: condition
      })
    ])
    return {
      likes,
      count
    };
  }

  async getUserByLike(userId: string) : Promise<User> {
    const getLike = await this.likesRepository.findOne({
      where: {userId},
      relations: {user: true}
    })
    return getLike.user;
  }
 
}
