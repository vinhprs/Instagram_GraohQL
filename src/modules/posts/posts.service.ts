import { Injectable, NotFoundException } from '@nestjs/common';
import { getUserIdFromRequest } from '../../utils/jwt.utils';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilesService } from '../profiles/profiles.service';
import { Profile } from '../profiles/entities/profile.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly profilesService: ProfilesService,
    private readonly notificationsService: NotificationsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService
  ) {} 

  async create(createPostInput: CreatePostInput, req: Request) : Promise<Post> {
    const userId: string = getUserIdFromRequest(req);
    
    const profile = await this.profilesService.getProfileByUser(userId);

    const post: Post = this.postRepository.create(createPostInput);
    post.profileId = profile.id;
    post.createdAt = new Date(Date.now());
    post.updatedAt = new Date(Date.now());
    
    await this.notificationsService.createNotifications(userId);
    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find();
  }

  async findOneById(id: string) {
    return await this.postRepository.findOneBy({id});
  }

  async updatePost(updatePostInput: UpdatePostInput) {
    const post: Post = await this.postRepository.findOneBy({id: updatePostInput.id})
    if(!post) {
      throw new NotFoundException('This post is not exist!');
    } 
    post.description = updatePostInput.description;

    return await this.postRepository.save(post);
  }

  async deletePost(id: string, req: Request) : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);
    const profile: Profile = await this.profilesService.getProfileByUser(userId);

    const post: Post = await this.postRepository.findOneBy({id});
    if(post.profileId !== profile.id) {
      throw new NotFoundException('This post is not your own!');
    }

    return await this.postRepository.delete({id}) ? true : false
  }

  async getCommentOnPost(postId: string) : Promise<Comment[]>{
    return await this.commentsService.getCommentByPost(postId);
  }

  async getLikeOnPost(postId: string) : Promise<number> {
    return await this.likesService.getLikeByPost(postId);
  }

  async getProfileOnPost(profileId: string) : Promise<Profile[]> {
    return await this.profilesService.getProfileByPost(profileId);
  }
}
