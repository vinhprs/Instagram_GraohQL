import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field({nullable: true})
  description: string;

  @Field(() => String ,{nullable: true})
  imageUrl: string ;
}
