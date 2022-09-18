import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReplyCommentInput {
  @Field()
  postId: string;

  @Field()
  replyTo: string;

  @Field()
  content: string;

}
