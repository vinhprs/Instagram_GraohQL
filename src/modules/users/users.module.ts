import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfilesModule } from "../profiles/profiles.module";
import { User } from "./entity/users.entity";
import { UserResolver } from "./users.resolver";
import { UsersService } from "./users.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ProfilesModule
    ],
    exports: [TypeOrmModule, UsersService],
    providers: [UsersService, UserResolver]
})

export class UsersModule {}