import { Injectable, Logger } from '@nestjs/common';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../constants/mail.constant';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../../users/core/schemas/user.schema';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(private readonly _mailerService: MailerService, private readonly _configService: ConfigService) {
  }

  @OnQueueActive()
  public onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job) {
    this._logger.debug(`Job ${job.id} of type ${job.name} completed`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this._logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(job: Job<{ user: User; confirmUrl: string }>) {
    this._logger.log(`Sending confirm registration email to '${job.data.user.authentication.emailAddress}'`);

    try {
      return this._mailerService.sendMail({
        to: job.data.user.authentication.emailAddress,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Confirm registration',
        template: 'registration',
        context: {
          confirmUrl: job.data.confirmUrl
        }
      });
    } catch (error) {
      this._logger.error(`Failed to send confirmation email to '${job.data.user.authentication.emailAddress}'`);
    }
  }
}
