import { InputType, Field } from '@nestjs/graphql';
import { MinLength, IsEmail } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType() 
export class SignupInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field({nullable: true})
  displayName: string;

  @Field({nullable: true})
  DOB: Date;

  @Field({nullable: true})
  bio: string;

}

@InputType()
export class ActiveOtpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  otp_code: string;
}
