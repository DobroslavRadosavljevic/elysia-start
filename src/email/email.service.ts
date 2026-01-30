import type {
  CreateBatchOptions,
  CreateBatchRequestOptions,
  CreateEmailOptions,
  CreateEmailRequestOptions,
} from "resend";

import { resend } from "./client";

export class EmailService {
  send(payload: CreateEmailOptions, options?: CreateEmailRequestOptions) {
    return resend.emails.send(payload, options);
  }

  sendBatch(payload: CreateBatchOptions, options?: CreateBatchRequestOptions) {
    return resend.batch.send(payload, options);
  }
}

export const emailService = new EmailService();
