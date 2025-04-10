import { ConflictException, Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  public async signUp(registerInput: RegisterInput) {
    const findUser = await this.userService.findByEmail(registerInput.email);

    if (findUser) {
      throw new ConflictException(
        'Пользователь с таким email уже зарегестрирован',
      );
    }

    const hashedPassword = await this.hashData(registerInput.password);

    const createdUser = await this.userService.create({
      ...registerInput,
      password: hashedPassword,
      refreshToken: '',
    });

    const tokens = await this.getTokens(createdUser.id, createdUser.name);
    await this.updateRefreshToken(createdUser.id, tokens.refreshToken);

    return tokens;
  }

  signIn(loginInput: LoginInput) {
    return 'This action adds a new auth';
  }

  updateRefreshToken(userId: string, refreshToken: string) {
    return this.userService.update({ id: userId, refreshToken });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>(
            'JWT_REFRESH_SECRET',
          ) as string,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
