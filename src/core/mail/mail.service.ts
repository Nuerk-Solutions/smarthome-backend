import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(
    private readonly _configService: ConfigService,
  ) {
    SendGrid.setApiKey(this._configService.get<string>('SENDGRID_API_KEY'));
  }

  public async sendEmail(mail: SendGrid.MailDataRequired): Promise<[ClientResponse, {}]> {
    const transport = await SendGrid.send(mail);
    this._logger.log(`Email send to ${mail.to}`);
    return transport;
  }

  // TODO: Move this somewhere else
  // public async sendConfirmationEmail(user: User): Promise<[ClientResponse, {}]> {
  //   const confirmUrl = this.getConfirmUrl(user.authentication.emailAddress);
  //
  //   const mail = {
  //     to: user.authentication.emailAddress,
  //     from: 'abrechnung@nuerk-solutions.de',
  //     subject: 'Abrechnung April',
  //     text: 'and easy to do anywhere, even with Node.js' + confirmUrl,
  //     html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  //   };
  //
  //   return await SendGrid.send(mail);
  // }
  //
  // private getConfirmUrl(emailAddress: string): string {
  //   const token = this._authenticationService.getJwtConfirmToken(emailAddress);
  //
  //   return `${this._configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
  // }
}
