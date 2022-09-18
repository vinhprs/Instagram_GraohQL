import { Resolver,  Mutation, Args,  Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { ActiveOtpInput, LoginUserInput, SignupInput } from './dto/auth.input';
import { JwtPayload } from '../modules/common/entities/common.entity';
import { Response } from 'express'
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => JwtPayload)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context("res") respone: Response
  )
  : Promise<JwtPayload> {
    try {
      const jwt = await this.authService.login(loginUserInput);
      this.authService.setTokenForUserCookie(respone, jwt);
      return jwt;
    } catch(e) {
      throw new HttpException(e.message, e.status || HttpStatus.FORBIDDEN)
    }
  }

  @Mutation(() => Boolean) 
  async activeOtp(
    @Args("activeOtpInput") activeOtpInput: ActiveOtpInput
  ) : Promise<boolean> {
    try {
      return await this.usersService.activeOtp(activeOtpInput);
    } catch(error) {
      throw new HttpException(error.message, error.status || HttpStatus.FORBIDDEN);
    }
  }

  @Mutation(() => JwtPayload) 
  async signup(
    @Args('signupUserInput') signupUserInput: SignupInput,
    @Context("res") response: Response
  ) : Promise<JwtPayload> {
    const jwt = await this.authService.signup(signupUserInput);
    this.authService.setTokenForUserCookie(response, jwt);
    return jwt;
  }

}
