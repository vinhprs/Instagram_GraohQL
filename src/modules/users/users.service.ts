import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveOtpInput, LoginUserInput, SignupInput } from 'src/auth/dto/auth.input';
import { Repository } from 'typeorm';
import { User } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { getUserIdFromRequest } from '../../utils/jwt.utils';
import { Follow } from '../follows/entities/follow.entity';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly profilesService: ProfilesService
  ) {}

  async validateUserInput(loginUserInput: LoginUserInput): Promise<User> {
    const userEmail = {email: loginUserInput.email};
    const user = await this.usersRepository.findOneBy(userEmail);
    if(!user) {
      throw new NotFoundException("Your email is not registered!");
    }
    const isValid = await bcrypt.compare(loginUserInput.password, user.password);
    if(!isValid) {
      throw new UnauthorizedException("You've entered an incorrect password!");
    }

    if(!user.isComfirmEmail) {
      throw new UnauthorizedException("Your email is not activated!");
    }

    return user;
  }

  async create(signupUserInput: SignupInput, randomCode: string) : Promise<User> {
    const user = this.usersRepository.create(signupUserInput);
    [user.otp_code, user.password] = await Promise.all([
      bcrypt.hash(randomCode, 12),
      bcrypt.hash(signupUserInput.password, 12)
    ])

    await this.usersRepository.save(user);
    return user;
  }
  
  async activeOtp(activeOtpInput: ActiveOtpInput) : Promise<boolean> {
    const user: User = await this.findOneByEmail(activeOtpInput.email);
    if(!user) {
      throw new NotFoundException("Your email does not match any!");
    }
    const validPassword = await bcrypt.compare(activeOtpInput.password, user.password);
    if(!validPassword) {
      throw new UnauthorizedException("Please provide a correct password!");
    }
    const validOtpCode = await bcrypt.compare(activeOtpInput.otp_code, user.otp_code);
    if(!validOtpCode) {
      throw new NotFoundException("Incorrect otp code!");
    }
    user.isComfirmEmail = true;
    await Promise.all([
      this.usersRepository.save(user),
      this.profilesService.autoCreateProfile(user)
    ]) 

    return true;
  }

  async setRefreshToken(userId: string, refreshToken: string) :Promise<User> {
    const oldUser = await this.usersRepository.findOneBy({id: userId});
    const user =  this.usersRepository.create(oldUser);

    user.currentRefreshToken = refreshToken;
    return await this.usersRepository.save(user);
  }

  async findAll() : Promise<User []> {
    return await this.usersRepository.find({
      relations: {
        profile: true,
        followers: true,
        followings: true
      }
    })
  }

  async getUsersFromFollower(follows: Follow []) {
    var result = [];
    for(let i=0; i< follows.length; i++) {
      let user = await this.usersRepository.findOneBy({id: follows[i].followerUsersId});
      result.push(user)
    }
    return result;
  }

  async getUsersFromFollowing(follows: Follow []) {
    var result = [];
    for(let i=0; i< follows.length; i++) {
      let user = await this.usersRepository.findOneBy({id: follows[i].followingUsersId});
      result.push(user)
    }
    return result;
  }
  

  async isActive(userId: string) : Promise<boolean> {
    const user = await this.usersRepository.findOneBy({id: userId});
    if(user.isActive === false)
      return false;
    return true;
  }

  async findOneByEmail(email: string) : Promise<User> { 
    const user: User = await this.usersRepository.findOne({ 
      where: {
        email
      },
      relations: {
        profile: true
      }
   });

    return user;
  }

  async findUserByEmail(email: string) : Promise<User> { 
    const user: User = await this.usersRepository.findOne({ 
      where: {
        email
      },
      relations: {
        profile: true
      }
   });
    const isActive = await this.isActive(user.id);
    if(!isActive) {
      throw new NotFoundException('Cannot find this user!');
    }

    return user;
  }

  async findOneById(id: string) : Promise<User> {
    return await this.usersRepository.findOneBy({id: id});
  }

  async findAllById(id: string) : Promise<User []> {
    return await this.usersRepository.find({ 
      where: {id},
    })
  }
 
  async deactiveAccount(req: Request) : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);

    const user: User = await this.findOneById(userId);
    if(!user) {
      throw new NotFoundException('Cannot fined user!');
    }
    user.isActive = false;

    return await this.usersRepository.save(user) ? true: false
  }

  async activeAccount(req: Request) : Promise<boolean> {
    const userId: string = getUserIdFromRequest(req);

    const user: User = await this.findOneById(userId);
    if(!user) {
      throw new NotFoundException('Cannot fined user!');
    }
    if(user.isActive) {
      throw new Error('Your account is not deactivated!');
    }
    user.isActive = true;

    return await this.usersRepository.save(user) ? true: false
  }

}