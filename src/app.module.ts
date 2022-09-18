import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { EmailModule } from './modules/email/email.module';
import { User } from './modules/users/entity/users.entity';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { Profile } from './modules/profiles/entities/profile.entity';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/entities/post.entity';
import { FollowsModule } from './modules/follows/follows.module';
import { Follow } from './modules/follows/entities/follow.entity';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { Notification } from './modules/notifications/entities/notification.entity';
import { LikesModule } from './modules/likes/likes.module';
import { Like } from './modules/likes/entities/like.entity';
import { CommentsModule } from './modules/comments/comments.module';
import { Comment } from './modules/comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306 ,
    username: 'root',
    password: '19052002',
    database: 'instagram',
    entities: [
      User, Profile, Post, Follow, Notification, Like, Comment
    ],
    synchronize: true
  }),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    context: ({ req, res }) => ({ req, res }),
    installSubscriptionHandlers: true,
    cors: {
      credentials: true,
      origin: true
    }
  }),
  UsersModule,
  AuthModule,
  EmailModule,
  ProfilesModule,
  PostsModule,
  FollowsModule,
  NotificationsModule,
  LikesModule,
  CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
