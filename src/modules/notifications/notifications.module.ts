import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UsersModule } from '../users/users.module';
import { FollowsModule } from '../follows/follows.module';
import { NotificationResolver } from './notifications.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule,
    FollowsModule
  ],
  providers: [NotificationResolver ,NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
