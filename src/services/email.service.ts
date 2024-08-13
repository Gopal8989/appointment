import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { SES } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private ses: SES;

  constructor(private configService: ConfigService) {
    this.ses = new AWS.SES({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    from: string = this.configService.get<string>('EMAIL_FROM'),
  ) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
    };

    return this.ses.sendEmail(params).promise();
  }
}
