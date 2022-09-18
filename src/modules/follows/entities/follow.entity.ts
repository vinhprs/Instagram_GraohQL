import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Follow {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable:true, default: null})
  followingUsersId: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable:true, default: null})
  followerUsersId: string;

  // followers - user: n-1
  @ManyToOne(() => User, (user) => user.followers)
  @Field(() => [User], {nullable: true})
  follower_users?: User [];

  // followings - user: n-1
  @ManyToOne(() => User, (user) => user.followings)
  @Field(() => [User], {nullable: true})
  following_users?: User [];
}
