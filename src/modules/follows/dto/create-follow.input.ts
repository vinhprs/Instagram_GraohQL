import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFollowInput {
  @Field()
  followingUsersId: string;
}
