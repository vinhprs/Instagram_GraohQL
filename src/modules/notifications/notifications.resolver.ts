import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotFoundException } from '@nestjs/common'

@Resolver(() => Notification)
export class NotificationResolver {
    constructor(
        private readonly notificationsService: NotificationsService
    ) {}

    @Query(() => [Notification])
    async getAllNotis() {
        try {
            return await this.notificationsService.getAll();
        } catch(err) {
            throw new NotFoundException(err.message);
        }
    }
}