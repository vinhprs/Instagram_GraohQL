import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Notification {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({nullable: true, defaultValue: true})
  @Column({nullable: true, default: true})
  conttent: string;

  @Field({nullable: true, defaultValue: true})
  @Column({nullable: true, default: true})
  userId: string;

  // users relationship: n-1
  @ManyToOne(() => User, (user) => user.notifications)
  @Field(() => User, {nullable: true})
  user: User;
}
