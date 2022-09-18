import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    UsersModule
  ],
  providers: [ProfilesResolver, ProfilesService],
  exports: [TypeOrmModule ,ProfilesService]
})
export class ProfilesModule {}
