import { InputType, Field } from '@nestjs/graphql';
import { FileUpload } from './upload-image.input';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
@InputType()
export class CreatePostInput {
  @Field(() => String ,{nullable: true})
  description: string;

  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>

  @Field(() => String ,{nullable: true, defaultValue: null})
  image_url?: string;
}
