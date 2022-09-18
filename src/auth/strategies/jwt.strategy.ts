import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_ACCESS_TOKEN_SECRET } from "../../constants/auth.constants";
import { IJwtPayload } from "../../modules/common/entities/common.entity";
import { User } from "../../modules/users/entity/users.entity";
import { UsersService } from "../../modules/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),                
            ]),
            ignoreExpiration: false,
            secretOrKey: JWT_ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload: IJwtPayload) : Promise<User> {
        try {
            const user: User = await this.usersService.findOneById(payload.id);
            if(!user) {
                throw new UnauthorizedException("Invalid token claims ");
            }
            return user;
        } catch(e) {
            throw new UnauthorizedException(e);
        }
    }

}