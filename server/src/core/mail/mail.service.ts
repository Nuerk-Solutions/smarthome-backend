import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from './constants/mail.constant';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/core/schemas/user.schema';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
    private readonly _configService: ConfigService,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly _authenticationService: AuthenticationService
  ) {
  }

  public async sendConfirmationEmail(user: User): Promise<void> {
    const confirmUrl = this.getConfirmUrl(user.authentication.emailAddress);

    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, {
        user,
        confirmUrl
      });
    } catch (error) {
      this._logger.error(`Error queueing registration email to user ${user.authentication.emailAddress}`);
      throw error;
    }
  }

  private getConfirmUrl(emailAddress: string): string {
    const token = this._authenticationService.getJwtConfirmToken(emailAddress);

    return `${this._configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
  }
}
