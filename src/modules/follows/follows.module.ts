import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsResolver } from './follows.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follow]),
    UsersModule
  ] ,
  providers: [FollowsResolver, FollowsService],
  exports: [TypeOrmModule, FollowsService]
})
export class FollowsModule {}
