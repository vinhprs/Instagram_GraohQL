import { Resolver, Mutation, Args, Context, ResolveField, Parent } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { ReplyCommentInput } from './dto/reply-comment.input';
import { Request } from 'express';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async commentOnPost(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context('req') req: Request
  ) : Promise<Comment> {
    try { 
      return await this.commentsService.commentOnPost(createCommentInput, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async replyComment(
    @Args('replyCommentInput') replyCommentInput: ReplyCommentInput,
    @Context('req') req: Request
  ) : Promise<Comment> {
    try { 
      return await this.commentsService.replyComment(replyCommentInput, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }
  
  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Context('req') req: Request
  ) {
    try { 
      return await this.commentsService.updateComment(updateCommentInput, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Args('id') id: string,
    @Context('req') req: Request
  ) : Promise<boolean> {
    try { 
      return await this.commentsService.deleteComment(id, req);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

  @ResolveField(() => [Comment])
  async reply(@Parent() comments: Comment)
  : Promise<Comment[]> {
    try {
      console.log(comments);
      return await this.commentsService.getReplyComments(comments.id);
    } catch(err) {
      throw new NotFoundException(err.message);
    }
  }

}
