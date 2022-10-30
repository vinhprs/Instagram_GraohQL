import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from '../modules/common/entities/common.entity';
import { User } from '../modules/users/entity/users.entity';
import { UsersService } from '../modules/users/users.service';
import { LoginUserInput, SignupInput } from './dto/auth.input';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { accessTokenAge, accessTokenKey, JWT_ACCESS_TOKEN_SECRET,
   JWT_REFRESH_TOKEN_SECRET, refreshTokenAge, refreshTokenKey } from '../constants/auth.constants';
import { randomOtp } from '../utils/randomString.utils';
import { EmailService } from '../modules/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService
  ) {}

  async login(loginUserInput: LoginUserInput): Promise<JwtPayload> {
    const user: User = await this.usersService.validateUserInput(loginUserInput);
    
    return await this.setJwt(user.id);
  }

  async signup(signupUserInput: SignupInput) : Promise<JwtPayload> {
    if(!signupUserInput.email || !signupUserInput.password) {
      throw new NotFoundException("Please provide a valid email or password!")
    }

    const isExistEmail = await this.usersService.findOneByEmail(signupUserInput.email);
    if(isExistEmail) {
      throw new UnauthorizedException("This email is exist!")
    }
    const randomCode : string = randomOtp(6);
    const user: User = await this.usersService.create(signupUserInput, randomCode);

    const [email, token] = await Promise.all([
      this.emailService.verifyEmail({
        to: user.email,
        from: "vinhnguyen19052002@gmail.com",
        subject: "This is otp code to verify your account",
        text: `Use the otp: ${randomCode} to active your account`
      }),
      this.setJwt(user.id)
    ])

    if(!email) {
      throw new NotFoundException("This email is not valid!")
    }

    return token;
  }

  async resendEmail(email: string) : Promise<boolean> {
      const randomCode : string = randomOtp(6);
      const done = await this.emailService.verifyEmail({
        to: email,
        from: "vinhnguyen19052002@gmail.com",
        subject: "This is otp code to verify your account",
        text: `Use the otp: ${randomCode} to active your account`
      })
      
      return done;
  }

  async setJwt(userId: string): Promise<JwtPayload> {
    const payload = {id: userId};

    const accessToken = sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: +accessTokenAge
    });
    const refreshToken = sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: +refreshTokenAge
    });
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const userInfo = await this.usersService.setRefreshToken(
      userId,
      currentHashedRefreshToken
    );

    const jwt: JwtPayload = new JwtPayload();
    jwt.userId = payload;
    jwt.payload = payload;
    jwt.accessToken = accessToken;
    jwt.refreshToken= refreshToken;
    jwt.userInfo = userInfo;

    return jwt;
  }

  getDateAfterSeconds(secs: number) {
    return new Date(Date.now() + secs * 1000);
  }

  setTokenForUserCookie(respone: Response, jwtPayLoad: JwtPayload) {
    try {
      const { accessToken, refreshToken } = jwtPayLoad;
      respone.cookie(accessTokenKey, accessToken, {
        expires: this.getDateAfterSeconds(accessTokenAge),
        path: "/"
      })
      respone.cookie(refreshTokenKey, refreshToken, {
        expires: this.getDateAfterSeconds(refreshTokenAge),
        path: "/"
      })
    } catch(err) {
      console.log("TRY TO SET COOKIE_ERROR: ", err)
    }
  }
}
