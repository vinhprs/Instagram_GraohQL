import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { cloudinary_config } from '../../config/gg-cloud-storage.config';
import { likeResult } from '../common/entities/common.entity';
@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    private readonly notificationsService: NotificationsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService
  ) {} 

  async create(createPostInput: CreatePostInput , req: Request) : Promise<Post> {

    const userId: string = getUserIdFromRequest(req);
    
    const [profile, images] = await Promise.all([
      this.profilesService.getProfileByUser(userId),
      this.uploadFile(createPostInput)
    ])
    if(!images) {
      throw new Error('Cannot upload file')
    }

    const post: Post = this.postRepository.create({
      description: createPostInput.description,
      image: images.img_url
    });
    post.profileId = profile.id;
    post.createdAt = new Date(Date.now());
    post.updatedAt = new Date(Date.now());
    
    await this.notificationsService.createNotifications(userId);
    return await this.postRepository.save(post);
  }

  async uploadFile(createPostInput: CreatePostInput) : Promise<any> {
    const {filename, createReadStream} = await createPostInput.image;
  
    return new Promise(async (resolve, reject) => {
      const upload_stream =  cloudinary_config.uploader.upload_stream(
        {
          folder: "instagram_graphQL"
        },
        (err, result) => {
          if(result) {
            resolve({
              img_url: result.url
            })
          } else {
            reject(err.message)
          }
        }
      )
      createReadStream()
        .pipe(upload_stream)
    })
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

  async getLikeOnPost(postId: string) : Promise<likeResult> {
    return await this.likesService.getLikeByPost(postId);
  }

  async getProfileOnPost(profileId: string) : Promise<Profile[]> {
    return await this.profilesService.getProfileByPost(profileId);
  }
}
