import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FollowsService } from './follows.service';
import { Follow } from './entities/follow.entity';
import { CreateFollowInput } from './dto/create-follow.input';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => Follow)
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Args('createFollowInput') createFollowInput: CreateFollowInput,
    @Context('req') req: Request
  ) : Promise<boolean> {
    try {
      return await this.followsService.followUser(createFollowInput, req);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unFollowUser(
    @Args('createFollowInput') createFollowInput: CreateFollowInput,
    @Context('req') req: Request
  ) : Promise<boolean> {
    try {
      return await this.followsService.unFollowUser(createFollowInput, req);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Query(() => [Follow])
  async getAllFollowInfo() : Promise<Follow []> {
    try {
      return await this.followsService.getAllFollowInfo();
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
    }
  }
}