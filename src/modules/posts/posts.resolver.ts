import { Resolver, Query, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Request } from 'express';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Comment } from '../comments/entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { Profile } from '../profiles/entities/profile.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context('req') req: Request
  ) : Promise<Post> {
    return await this.postsService.create(createPostInput, req);
  }

  @Query(() => [Post])
  async getAllPosts() {
    return await this.postsService.findAll();
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() posts: Post) 
  : Promise<Comment[]>{
    try {
      return await this.postsService.getCommentOnPost(posts.id);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @ResolveField(() => Number)
  async likes(@Parent() posts: Post)
  : Promise<number> {
    try {
      return await this.postsService.getLikeOnPost(posts.id);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @ResolveField(() => [Profile])
  async profile(@Parent() posts: Post)
  : Promise<Profile[]> {
    try {
      return await this.postsService.getProfileOnPost(posts.profileId);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput
  ) : Promise<Post> {
    try { 
      return await this.postsService.updatePost(updatePostInput);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Args('id', { type: () => String }) id: string,
    @Context('req') req: Request
  ) : Promise<boolean> {
    try {
      return await this.postsService.deletePost(id, req);
    } catch(err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
