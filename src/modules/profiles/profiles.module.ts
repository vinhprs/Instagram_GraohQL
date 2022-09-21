import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    UsersModule,
    forwardRef(() => PostsModule)
  ],
  providers: [ProfilesResolver, ProfilesService],
  exports: [TypeOrmModule ,ProfilesService]
})
export class ProfilesModule {}
