import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entity/users.entity';
import { Like } from '../../likes/entities/like.entity';

@ObjectType()
@Entity()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  userId: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  postId?: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  replyTo?: string;

  @Field({nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  content: string;

  @Field()
  @Column({type: 'timestamp', nullable: true})
  createdAt: Date;
  
  @Field()
  @Column({type: 'timestamp', nullable: true})
  updatedAt: Date;

  // User relationship: n-1
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  // Post relationship: n-1
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post

  // Likes relationship: 1-n
  @OneToMany(() => Like, (like) => like.comment)
  likes?: Like[];
}
