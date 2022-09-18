import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { ReplyCommentInput } from './dto/reply-comment.input';
import { Comment } from './entities/comment.entity';
import { Request } from 'express';
import { getUserIdFromRequest } from '../../utils/jwt.utils';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>
  ) {}

  async commentOnPost(
    createCommentInput: CreateCommentInput,
    req: Request
  ) : Promise<Comment> {
    const userId: string = getUserIdFromRequest(req);
    const comment = this.commentsRepository.create({userId, ...createCommentInput});
    comment.createdAt = new Date(Date.now());
    comment.updatedAt = new Date(Date.now());

    return await this.commentsRepository.save(comment);
  }

  async replyComment(
    replyCommentInput: ReplyCommentInput,
    req: Request
  ) : Promise<Comment> {
    const userId: string = getUserIdFromRequest(req);
    const comment = this.commentsRepository.create({userId, ...replyCommentInput});
    comment.createdAt = new Date(Date.now());
    comment.updatedAt = new Date(Date.now());

    return await this.commentsRepository.save(comment);
  }

  async updateComment(
    updateCommentInput: UpdateCommentInput,
    req: Request
  ) : Promise<Comment> {
    const userId: string = getUserIdFromRequest(req);
    const commentId: string = updateCommentInput.id;

    const comment = await this.commentsRepository.findOneBy({id: commentId});
    if(comment.userId !== userId) {
      throw new Error('This comment is not your own');
    } 
    comment.content = updateCommentInput.content;
    comment.updatedAt = new Date(Date.now());

    return await this.commentsRepository.save(comment);

  }

  async deleteComment(
    id: string, 
    req: Request
  ) : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);

    const comment = await this.commentsRepository.findOneBy({id});
    if(comment.userId !== userId) {
      throw new Error('This comment is not your own');
    } 
    return await this.commentsRepository.delete({id}) ? true: false;
  }

  async getCommentByPost(postId: string) 
  : Promise<Comment[]> {
    const commentsOnPost : Comment[] = await this.commentsRepository.find(
      {
        where: {
          postId,
          replyTo: IsNull()
        },
      }
    );
    return commentsOnPost;
  }

  async getReplyComments(id: string) 
  : Promise<Comment[]> {
    const replyComments: Comment[] = await this.commentsRepository.find({
      where: {
        replyTo: id
      }
    })
    return replyComments;
  }
}
