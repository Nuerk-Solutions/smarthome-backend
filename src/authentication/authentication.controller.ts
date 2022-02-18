import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from './core/dto/registration.dto';
import { RequestWithUserPayload } from './core/interfaces/request-with-user-payload.interface';
import { LocalAuthenticationGuard } from './core/guards/local-authentication.guard';
import { JwtRefreshTokenGuard } from './core/guards/jwt-refresh-token.guard';
import { JwtConfirmTokenGuard } from './core/guards/jwt-confirm-token.guard';
import { JwtAccessTokenGuard } from './core/guards/jwt-access-token.guard';
import { MailService } from '../core/mail/mail.service';
import { User } from '../users/core/schemas/user.schema';

@Controller('Authentication')
export class AuthenticationController {
  constructor(private readonly _authenticationService: AuthenticationService, private readonly _mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @Post('registration')
  async registration(@Body() registrationDto: RegistrationDto): Promise<User> {
    const user: User = await this._authenticationService.registration(registrationDto);

    await this._mailService.sendConfirmationEmail(user);

    return user;
  }

  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() request: RequestWithUserPayload): Promise<User> {
    const [accessTokenCookie, refreshTokenCookie] = await this._authenticationService.login(request.user);

    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return request.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('logout')
  async logout(@Req() request: RequestWithUserPayload): Promise<void> {
    await this._authenticationService.logout(request.user);

    request.res.setHeader('Set-Cookie', this._authenticationService.getCookiesForLogout());
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('refresh')
  refresh(@Req() request: RequestWithUserPayload): void {
    const accessTokenCookie = this._authenticationService.refreshToken(request.user);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
  }

  @UseGuards(JwtConfirmTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('confirm')
  async confirm(@Req() { user }: RequestWithUserPayload): Promise<void> {
    await this._authenticationService.confirm(user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('confirm/resend')
  async resendConfirmationLink(@Req() { user }: RequestWithUserPayload): Promise<void> {
    await this._authenticationService.resendConfirmationLink(user);
  }
}
