import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SendEmailMiddleware {
  private readonly logger = new Logger(SendEmailMiddleware.name);
  constructor(private mailerService: MailerService) { }

  sendEmail(email: string, token: string, attachmentsArray) {
    let subjectObject = {
      subjectTitle: 'Email bestätigen für Nuerk-Solutions.de',
      subjectBody: `Hallo ,<br> bitte bestätige die email '${email}'.<br>
            Benutze dazu diesen Token:  ${token} <br>`,
    };
    try {
      let mailOptions = {
        to: email,
        subject: subjectObject.subjectTitle,
        html: subjectObject.subjectBody,
        attachments: attachmentsArray,
      };
      this.mailerService.sendMail(mailOptions).then((info) => {
        this.logger.log('email sent', info);
      }).catch((err) => {
        this.logger.error('email not sent', err);
      });
    } catch (error) {
      this.logger.log('error', error);
    }
  }
}
