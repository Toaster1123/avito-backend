import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';
import { Logout } from './entities/logout.entity';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  signUp(@Args('signUpInput') signUpInput: RegisterInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => Auth)
  signIn(@Args('signInInput') signInInput: RegisterInput) {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => Logout)
  logout(@Req() req: Request) {
    return this.authService.logout(req.user!['sub']);
  }
}
