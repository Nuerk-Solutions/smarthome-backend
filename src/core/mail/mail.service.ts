import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(private readonly _configService: ConfigService) {
    SendGrid.setApiKey(this._configService.get<string>('SENDGRID_API_KEY'));
  }

  public async sendEmail(mail: SendGrid.MailDataRequired, multiple: boolean = false): Promise<[ClientResponse, {}]> {
    const transport = await SendGrid.send(mail, multiple);
    this._logger.log(`Email send to ${mail.to}`);
    return transport;
  }
}
