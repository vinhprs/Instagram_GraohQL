import { Query ,Mutation, Resolver, Args, Context, ResolveField, Parent } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entity/users.entity";
import { UseGuards, HttpException, HttpStatus } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { NotFoundException } from "@nestjs/common/exceptions";
import { Request } from 'express';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User]) 
    @UseGuards(JwtAuthGuard)
    async getAllUsers() : Promise<User []> {
        try {
           const result = await this.usersService.findAll();
           return result;
        } catch(err) {
            throw new NotFoundException(err.message);
        }
    }

    @ResolveField(() => [User])
    async follower_users(@Parent() users: User){
        try {
            const result = await this.usersService.getUsersFromFollower(users.followers);
            return result;
        } catch(err) {
            throw new NotFoundException(err.message);
        }
    }

    @ResolveField(() => [User])
    async following_users(@Parent() users: User){
        try {
            const result = await this.usersService.getUsersFromFollowing(users.followings);
            return result;
        } catch(err) {
            throw new NotFoundException(err.message);
        }
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async findUserByEmail(
        @Args("email") email: string
    ) : Promise<User> {
        try {
            return await this.usersService.findUserByEmail(email);
        } catch(err) {
            throw new NotFoundException(err.message);
        }
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async deactiveAccount(
        @Context('req') req: Request
    ) : Promise<boolean> {
        try {
            return await this.usersService.deactiveAccount(req);
        } catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async activeAccount(
        @Context('req') req: Request
    ) : Promise<boolean> {
        try {
            return await this.usersService.activeAccount(req);
        } catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}