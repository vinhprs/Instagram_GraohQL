import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Notification } from './entities/notification.entity';
import { FollowsService } from '../follows/follows.service';

@Injectable()
export class NotificationsService {

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly followsService: FollowsService
  ) {}

  async getAll() {
    return await this.notificationsRepository.find();
  }
  
  async createNotifications(userId: string)
  : Promise<void> {
    const [user, followers] = await Promise.all(
      [
        this.usersService.findOneById(userId),
        this.followsService.getFollowersByUserId(userId)
      ]
    )
    if(followers.length > 0) {
      followers.forEach(async (follower) => {
        const notification = new Notification();
        notification.userId = follower.followerUsersId;
        this.getNotificationContent(user.email, notification);
        await this.notificationsRepository.save(notification);
      })
    }
  }

  getNotificationContent(email: string, notification: Notification) : void {
    const content = `${email} just posted a new photo`;
    notification.conttent = content;
  }
 }
