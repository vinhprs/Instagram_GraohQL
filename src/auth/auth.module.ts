import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../modules/users/users.module';
import { EmailModule } from '../modules/email/email.module';

@Module({
  imports: [UsersModule, EmailModule],
  providers: [AuthResolver, AuthService],
  exports: [AuthModule]
})
export class AuthModule {}
