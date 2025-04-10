import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field({ description: 'Имя пользователя' })
  name: string;

  @Field({ description: 'Email пользователя' })
  email: string;

  @Field({ description: 'Password пользователя' })
  password: string;

  @Field({ description: 'Токен обновления', nullable: true })
  refreshToken: string | null;
}
