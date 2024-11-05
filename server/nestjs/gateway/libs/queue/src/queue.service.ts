import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface EmailProps {
  toEmail: string;
  subject: string;
  html?: string;
}

@Injectable()
@Processor('mail-queue')
export class QueueService extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process({ data }: { data: EmailProps }): Promise<any> {
    try {
      return this.sendMail(data);
    } catch (e: unknown) {
      console.log(`Exception ${e}`);
    }
  }

  private async sendMail(emailProps: EmailProps) {
    const { html, subject, toEmail } = emailProps;
    try {
      await this.mailerService.sendMail({
        to: toEmail,
        from: 'TIKI clone',
        subject,
        html,
      });
      console.log('Done sending');
    } catch (error: unknown) {
      console.log(`Error when sending: ${error}`);
    }
  }
}
