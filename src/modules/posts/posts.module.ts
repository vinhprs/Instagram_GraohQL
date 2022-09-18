import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity'
import { ProfilesModule } from '../profiles/profiles.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesModule } from '../likes/likes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    ProfilesModule,
    NotificationsModule,
    CommentsModule,
    LikesModule
  ],
  providers: [PostsResolver, PostsService],
  exports: [TypeOrmModule, PostsService]
})
export class PostsModule {}
