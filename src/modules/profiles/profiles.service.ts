import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileInput } from './dto/create-profile.input';
import { Profile } from './entities/profile.entity';
import { getUserIdFromRequest } from '../../utils/jwt.utils';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
    private readonly usersService: UsersService
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

  async findAll() : Promise<Profile []> {
    return await this.profilesRepository.find({
      relations: {
        posts: true
      }
    });
  }

  async getProfileByUser(userId: string) : Promise<Profile> {
    const profile: Profile = await this.profilesRepository.findOne({
      where: {
        userId
      },
      relations: {
        posts: true
      }
    });

    if(!profile) {
      throw new NotFoundException("This profile is not exist!");
    }
    const isActive = await this.usersService.isActive(userId);

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
