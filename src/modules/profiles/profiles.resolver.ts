import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';
import { UseGuards } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common/exceptions';

@Resolver("Profile")
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Mutation(() => Profile)
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
    @Context('req') req: Request
  ) : Promise<Profile> {
    return await this.profilesService.create(createProfileInput, req);
  }

  @Query(() => [Profile])
  @UseGuards(JwtAuthGuard)
  async getAllProfiles() : Promise<Profile []> {
    const result = this.profilesService.findAll()
    if(!result) {
      return [];
    }
    return result;
  }
  
  @Query(() => Profile)
  @UseGuards(JwtAuthGuard)
  async findProfileByUser(
    @Args("userId") userId: string
  ) : Promise<Profile> {
    try {
      return await this.profilesService.getProfileByUser(userId);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

}
