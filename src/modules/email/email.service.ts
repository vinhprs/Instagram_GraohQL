import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { sendGridAPIKey } from '../../constants/sendGrid.constants';

@Injectable()
export class EmailService {
  
  constructor() {
    sgMail.setApiKey(sendGridAPIKey)
  }

  async verifyEmail(msg: sgMail.MailDataRequired | sgMail.MailDataRequired[]) : Promise<Boolean> {
    try {
      await sgMail.send(msg)
      return true;
    } catch(error) {
      throw new HttpException("Please provide a valid email!", HttpStatus.BAD_REQUEST);
    }
  }

}
