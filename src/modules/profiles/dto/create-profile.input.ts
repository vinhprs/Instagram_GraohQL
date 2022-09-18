import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProfileInput {
  @Field()
  displayName: string;

  @Field()
  dob: String;

  @Field({nullable: true})
  bio: string;

}
