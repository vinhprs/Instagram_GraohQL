import { ObjectType, Field,  } from '@nestjs/graphql';
import { Profile } from '../../profiles/entities/profile.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Like } from '../../likes/entities/like.entity';
import { Comment } from '../../comments/entities/comment.entity';

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({nullable:true, defaultValue: null})
  @Column({nullable: true, default: true})
  description?: string;

  @Field(() => String, {nullable: true, defaultValue: null})
  @Column({nullable: true, default: null})
  image?: string;

  @Field()
  @Column({type: 'timestamp', nullable: true})
  createdAt: Date;
  
  @Field()
  @Column({type: 'timestamp', nullable: true})
  updatedAt: Date;

  @Field()
  @Column()
  profileId: string;

  // profiles relationship:  n-1
  @ManyToOne(() => Profile, (profile) => profile.posts)
  profile: Profile;

  // likes relationship: 1-n
  @OneToMany(() => Like, (like) => like.post)
  likes?: Like[];

  // comments relationship: 1-n
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
