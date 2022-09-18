import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesResolver } from './likes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../likes/entities/like.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikesResolver, LikesService],
  exports: [TypeOrmModule ,LikesService]
})
export class LikesModule {}
