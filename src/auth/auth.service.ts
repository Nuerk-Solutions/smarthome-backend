import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {v4 as uuidv4} from 'uuid';
import {Role} from '../core/enums/role.enum';
// import { RequestContextMetadataService } from '../core/services/request-context-metadate.service';
import {SendEmailMiddleware} from '../core/middleware/send-email.middleware';
import {AuthCredentialsDto, AuthEmailDto, CreateUserDto, UpdateUserDto} from './dto/auth-credentials.dto';
import {TokenVerifyEmail, User} from './schemas/user.schema';
import {Tokens} from './types/tokens.type';
import {ConfigService} from '@nestjs/config';
import {JwtPayload} from './types/jwt-payload.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('TokenVerifyEmail')
        private tokenVerifyEmailModel: Model<TokenVerifyEmail>,
        private jwtService: JwtService,
        private sendEmailMiddleware: SendEmailMiddleware,
        private config: ConfigService,
    ) {
    }

    async signupLocal(createUserDto: CreateUserDto) {
        if (!(createUserDto.roles.includes(Role.Admin) || createUserDto.roles.includes(Role.User))) {
            throw new BadRequestException(`roles must include one of 'admin' or 'user'`);
        }

        const userToAttempt = await this.findOneByEmail(createUserDto.email);
        // Check if email is already registered
        if (!userToAttempt) {
            const newUser = new this.userModel({
                email: createUserDto.email,
                name: createUserDto.name,
                roles: createUserDto.roles,
                password: createUserDto.password, // Password is hashed in schema
            });
            return await newUser.save().then(async (user) => {
                const newTokenVerifyEmail = new this.tokenVerifyEmailModel({
                    userId: user._id,
                    tokenVerifyEmail: uuidv4(),
                });
                await newTokenVerifyEmail.save();

                this.sendEmailMiddleware.sendEmail(user.email, newTokenVerifyEmail.tokenVerifyEmail, []);
                const tokens = await this.getTokens(newUser._id, newUser.email);
                await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
                // Todo: Send refresh token
                return user.toObject({versionKey: false});
            });
        } else {
            throw new BadRequestException('Email already exist!');
        }
    }

    async deleteUser(auth: AuthEmailDto) {
        if (!auth.email) {
            throw new BadRequestException('Email have to be provided.');
        }
        try {
            return await this.userModel
                .findOneAndRemove({email: auth.email})
                .then((e) => {
                    return `Success delete ${auth.email} account.`;
                })
                .catch((e) => {
                    return new BadRequestException('Email is not exist!');
                });
        } catch (e) {
            console.log('error', e);
        }
    }

    async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
        try {
            return await this.findOneByEmail(updateUserDto.email).then((data) => {
                if (data) {
                    return this.userModel
                        .findByIdAndUpdate(
                            {_id: data._id},
                            {
                                email: updateUserDto.email,
                                name: updateUserDto.name,
                            },
                            {new: true},
                        )
                        .then((user) => {
                            console.log('### User Updated ###', user.toObject({versionKey: false}));
                            return user;
                        });
                } else {
                    throw new UnauthorizedException();
                }
            });
        } catch (e) {
            console.log('error', e);
        }
    }

    async signinLocal(authCredentialsDto: AuthCredentialsDto) {
        const userToAttempt: any = await this.findOneByEmail(authCredentialsDto.email);
        if (!userToAttempt) throw new BadRequestException('Email not found!');

        return new Promise((resolve, reject) => {
            userToAttempt.checkPassword(authCredentialsDto.password, async (err, isMatch) => {
                if (err) {
                    reject(new UnauthorizedException('Access Denied'));
                }
                if (isMatch) {
                    const user = userToAttempt.toObject({versionKey: false});
                    if (user.emailVerified) {
                        const tokens = await this.getTokens(userToAttempt._id, userToAttempt.email);
                        await this.updateRefreshTokenHash(userToAttempt._id, tokens.refresh_token);
                        // RequestContextMetadataService.setMetadata('AUTH_METADATA', user);
                        resolve(tokens);
                    } else {
                        reject(new UnauthorizedException('Please verify your email before login.'));
                    }
                } else {
                    reject(new BadRequestException(`Password don't match`));
                }
            });
        });
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email: email});
    }

    async getAllUsers() {
        return this.userModel.find();
    }

    async getUserFromAuth(userId: string): Promise<any> {
        const user = await this.userModel.findById({_id: userId}).then((u) => u.toObject({versionKey: false}));
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    // async validateUserByJwt(payload: JwtPayload) {
    //   const user = await this.findOneByEmail(payload.email).then((u) => u.toObject({ versionKey: false }));
    //   if (user) {
    //     RequestContextMetadataService.setMetadata('AUTH_METADATA', user);
    //     return user;
    //   } else {
    //     throw new UnauthorizedException();
    //   }
    // }

    async verifyTokenByEmail(token: string) {
        try {
            return await this.tokenVerifyEmailModel.findOne({tokenVerifyEmail: token}).then((data) => {
                if (data) {
                    return this.userModel.findByIdAndUpdate({_id: data.userId}, {emailVerified: true}, {new: true}).then(() => {
                        return true;
                    });
                } else {
                    return false;
                }
            });
        } catch (e) {
            console.log('error', e);
        }
    }

    async logout(userId: string) {
        await this.userModel.updateMany({_id: userId, refreshToken: {$ne: null}}, {refreshToken: null});
        return true;
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userModel.findById({_id: userId});
        if (!user || !user.refreshToken) throw new UnauthorizedException();

        const refreshTokenMatches = await bcrypt.compare(user.refreshToken, user.password, (err, res) => {
            console.log('MATCH!');
            return res == true;
        });

        if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshTokenHash(user._id, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshTokenHash(userId: string, refreshToken: string): Promise<void> {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return console.log(err);
            bcrypt.hash(refreshToken, salt, async (err, hash) => {
                if (err) return console.log(err);
                await this.userModel.findByIdAndUpdate({_id: userId}, {hashedRefreshToken: hash}).then((user) => {
                    console.log('### User Updated HASH ###', user);
                });
            });
        });
    }

    async getTokens(userId: string, email: string): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: userId,
            email: email,
        };

        const [authToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('AUTH_TOKEN_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            auth_token: authToken,
            refresh_token: refreshToken,
        };
    }
}
