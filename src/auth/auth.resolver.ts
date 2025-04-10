import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { RegisterInput } from './dto/register.input';

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
}
