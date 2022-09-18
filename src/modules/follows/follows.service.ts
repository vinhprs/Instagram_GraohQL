import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFollowInput } from './dto/create-follow.input';
import { Follow } from './entities/follow.entity';
import { Request } from 'express';
import { getUserIdFromRequest } from '../../utils/jwt.utils';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
  ) {}

  async followUser(createFollowInput: CreateFollowInput, req: Request)
   : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);
    if(userId === createFollowInput.followingUsersId) {
      throw new Error('You cannot follow your self!');
    }

    const isFollowed: boolean = await this.existFollow(userId, createFollowInput.followingUsersId);
    if(isFollowed) {
      throw new Error('You\'ve already followed this user!');
    }

    const following: Follow = this.followsRepository.create(createFollowInput);
    following.followerUsersId = userId;

    return await this.followsRepository.save(following) ? true: false;

  }

  async unFollowUser(createFollowInput: CreateFollowInput, req: Request)
   : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);
    if(userId === createFollowInput.followingUsersId) {
      throw new Error('You cannot unfollow your self!');
    }

    const isUnFollowed: boolean = await this.existFollow(userId, createFollowInput.followingUsersId);
    if(!isUnFollowed) {
      throw new Error('You dont follow this user!');
    }

    return await this.followsRepository.delete({
      followerUsersId: userId,
      followingUsersId: createFollowInput.followingUsersId
    }) ? true: false;

  }

  async getAllFollowInfo() : Promise<Follow []> {
    return await this.followsRepository.find({
      relations: {
        follower_users: true,
        following_users: true
      }
    })
  }

  async existFollow(userId: string, followings_id: string): Promise<boolean> {
    return await this.followsRepository.findOne({
      where: {
        followerUsersId: userId,
        followingUsersId: followings_id
      }
    }) ? true: false;
  }

  async getFollowersByUserId(userId: string) : Promise<Follow []> {
    return await this.followsRepository.find({
      where: {
        followingUsersId: userId
      }
    })
  }
}
