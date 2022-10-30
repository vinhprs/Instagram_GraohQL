import { ObjectType, Field,  } from '@nestjs/graphql';
import { User } from '../../users/entity/users.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
@Entity()
export class Profile {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  displayName: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  dob: String;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  bio: string;

  // Users relationships: 1-1
  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  @Field(() => User, {nullable: true})
  user: User

  @Column()
  @Field()
  userId: string;

  // Posts relationships: 1-n
  @OneToMany(() => Post, (post) => post.profile)
  @Field(() => [Post], {nullable: true})
  posts: Post[]
}
