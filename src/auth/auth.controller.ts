import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from '../core/decorators/role.decorator';
import { Role } from '../core/enums/role.enum';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthEmailDto, CreateUserDto, UpdateUserDto } from './dto/auth-credentials.dto';
import { Public } from '../core/decorators/public.decorator';
import { GetCurrentUserId } from '../core/decorators/get-current-user-id.decorator';
import { RefreshTokenGuard } from '../core/guards/refresh-token.guard';
import { GetCurrentUser } from '../core/decorators/get-current-user.decorator';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  async signupLocal(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signupLocal(createUserDto);
  }

  @Public()
  @Get('/verify/:token')
  @HttpCode(HttpStatus.OK)
  async verifyTokenByEmail(@Param('token') token: string) {
    return await this.authService.verifyTokenByEmail(token);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.signinLocal(authCredentialsDto);
  }

  @Put('update')
  @Roles(Role.Admin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.authService.updateUser(updateUserDto);
  }

  @Post('user')
  @Roles(Role.Admin, Role.User)
  @HttpCode(HttpStatus.OK)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(@GetCurrentUserId() userId: string) {
    return this.authService.getUserFromAuth(userId);
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUserId() userId: string, @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('users')
  @Roles(Role.Admin)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('delete')
  async delete(@Body(ValidationPipe) auth: AuthEmailDto) {
    return await this.authService.deleteUser(auth);
  }
}
