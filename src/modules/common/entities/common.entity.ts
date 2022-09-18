import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entity/users.entity";

@ObjectType()
export class IJwtPayload {
    @Field({ nullable: true })
    id: string;
}

@ObjectType()
export class JwtPayload {
    @Field({ nullable: true })
    accessToken: string;

    @Field({ nullable: true })
    refreshToken: string;

    @Field(() => JwtPayload, { nullable: true })
    payload?: IJwtPayload;

    @Field(() => IJwtPayload, { nullable: true })
    userId: IJwtPayload;

    @Field(() => User, { nullable: true })
    userInfo: User;
}