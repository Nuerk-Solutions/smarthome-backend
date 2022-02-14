import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from './core/dto/registration.dto';
import { authentications as Authentication, users as User } from '@prisma/client';
import { RequestWithUser } from './core/interfaces/request-with-user.interface';
import { LocalAuthenticationGuard } from './core/guards/local-authentication.guard';
import { JwtRefreshTokenGuard } from './core/guards/jwt-refresh-token.guard';
import { JwtConfirmTokenGuard } from './core/guards/jwt-confirm-token.guard';
import { JwtAccessTokenGuard } from './core/guards/jwt-access-token.guard';

@Controller('Authentication')
export class AuthenticationController {
  // Todo integrate mail service
  constructor(private readonly _authenticationService: AuthenticationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('registration')
  async registration(@Body() registrationDto: RegistrationDto): Promise<User> {
    const user = await this._authenticationService.registration(registrationDto);

    // Todo send Mail
    return user;
  }

  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<User> {
    const [accessTokenCookie, refreshTokenCookie] = await this._authenticationService.login(request.user);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return request.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('logout')
  async logout(@Req() request: RequestWithUser): Promise<void> {
    await this._authenticationService.logout(request.user);

    request.res.setHeader('Set-Cookie', this._authenticationService.getCookiesForLogout());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser): void {
    const accessTokenCookie = this._authenticationService.refreshToken(request.user);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
  }

  @UseGuards(JwtConfirmTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('confirm')
  async confirm(@Req() { user }: RequestWithUser): Promise<void> {
    await this._authenticationService.confirm(user.authentication);
  }

  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('confirm/resend')
  async resendConfirmationLink(@Req() { user }: RequestWithUser): Promise<void> {
    await this._authenticationService.resendConfirmationLink(user.authentication);
  }
}
