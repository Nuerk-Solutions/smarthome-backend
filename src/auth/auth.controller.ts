import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from './../core/decorators/role.decorator';
import { Role } from './../core/enums/role.enum';
import { JwtAuthGuard } from './../core/guards/jwt-auth.guard';
import { RolesGuard } from './../core/guards/roles.guards';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  AuthEmailDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Get('/verify/:token')
  async verifyTokenByEmail(@Param('token') token: string) {
    return await this.authService.verifyTokenByEmail(token);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.validateUserByPassword(authCredentialsDto);
  }

  @Put('/update')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.authService.updateUser(updateUserDto);
  }

  @Get('/user')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser() {
    return await this.authService.getUserFromAuth();
  }

  @Get('/users')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/delete')
  async delete(@Body(ValidationPipe) auth: AuthEmailDto) {
    return await this.authService.deleteUser(auth);
  }
}
