import { Field, HideField, ObjectType } from "@nestjs/graphql";
import { Follow } from "../../follows/entities/follow.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "../../profiles/entities/profile.entity";
import { Notification } from "../../notifications/entities/notification.entity";
import { Like } from "../../likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";

@ObjectType()
@Entity()
export class User {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    email: string;

    @HideField()
    @Column()
    password: string;

    @Field()
    @Column()
    otp_code: string;

    @Field({defaultValue: false})
    @Column({default: false})
    isComfirmEmail: boolean;

    @Field({nullable: true, defaultValue: null})
    @Column({nullable: true, default: null})
    otp_exprise?: number;

    @HideField()
    @Column({nullable: true, default: null})
    currentRefreshToken?: string;

    @Field({defaultValue: true})
    @Column({default: true})
    isActive: boolean;

    // Profiles relationship: 1-1
    @OneToOne(() => Profile, profile => profile.user)
    @Field(() => Profile, {nullable: true})
    profile: Profile

    // Followers relationship: 1-n
    @OneToMany(() => Follow, (follow) => follow.following_users)
    followers: Follow [];

    // Followings relationship: 1-n
    @OneToMany(() => Follow, (follow) => follow.follower_users)
    followings: Follow [];

    // Notifications relationship: 1-n
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    // Likes relationship: 1-n
    @OneToMany(() => Like, (like) => like.user) 
    likes: Like[];

    // Comments relationship: 1-n
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
    
}