import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProfileInput {
  @Field({nullable: true})
  displayName: string;

  @Field({nullable: true})
  dob: String;

  @Field({nullable: true})
  bio: string;

}
