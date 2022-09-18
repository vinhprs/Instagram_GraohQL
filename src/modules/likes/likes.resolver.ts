import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { LikesService } from './likes.service';
import { Like } from './entities/like.entity';
import { Request } from 'express';
import { NotFoundException , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => Like)
export class LikesResolver {
  constructor(private readonly likesService: LikesService) {}

  @Mutation(() => Like)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Args('postId') postId: string,
    @Context('req') req: Request
  ) : Promise<Like> {
    try {
      return await this.likesService.likePost(postId, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Args('postId') postId: string,
    @Context('req') req: Request
  ) : Promise<boolean> {
    try {
      return await this.likesService.unlikePost(postId, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @Mutation(() => Like)
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Args('commentId') commentId: string,
    @Context('req') req: Request
  ) : Promise<Like> {
    try {
      return await this.likesService.likeComment(commentId, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }
}

