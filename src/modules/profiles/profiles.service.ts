import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileInput } from './dto/create-profile.input';
import { Profile } from './entities/profile.entity';
import { getUserIdFromRequest } from '../../utils/jwt.utils';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PostsService } from '../posts/posts.service';
import { Post } from '../../modules/posts/entities/post.entity';
import { User } from '../users/entity/users.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async create(createProfileInput: CreateProfileInput, req: Request) : Promise<Profile> {
    const userId: string = getUserIdFromRequest(req);
    const profile : Profile = this.profilesRepository.create(createProfileInput);
    profile.userId = userId;
    
    const existProfile = await this.existProfile(userId);
    if(existProfile) {
      throw new Error("Your profile is exist!");
    }

    return await this.profilesRepository.save(profile);
  }

  async existProfile(userId: string) : Promise<Profile> {
    return await this.profilesRepository.findOneBy({userId});
  }

  async autoCreateProfile(user: User) : Promise<Profile> {
    const profile: Profile = this.profilesRepository.create({userId: user.id});
    profile.displayName = user.email;

    return await this.profilesRepository.save(profile);
  }

  async findAll() : Promise<Profile []> {
    return await this.profilesRepository.find({
      relations: {
        posts: true,
        user: true
      }
    });
  }

  async getProfileByUser(userId: string) : Promise<Profile> {
    const profile: Profile = await this.profilesRepository.findOne({
      where: {
        userId
      },
      relations: {
        posts: true,
        user: true
      }
    });

    if(!profile) {
      throw new NotFoundException("This profile is not exist!");
    }
    const isActive = profile.user.isActive;

    if(!isActive) {
      throw new NotFoundException("This user is not exist!");
    }
    return profile;
  }

  async getProfileByPost(profileId: string) : Promise<Profile[]> {
    return await this.profilesRepository.find({
      where: {id: profileId}
    })
  }
}
