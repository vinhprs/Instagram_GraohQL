import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entity/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

@ObjectType()
@Entity()
export class Like {
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
  commentId?: string;

  // users relationship: n-1
  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  // posts relationship: n-1
  @ManyToOne(() => Post, (post) => post.likes)
  post?: Post;

  // comments realationship: n-1
  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment?: Comment;
}
