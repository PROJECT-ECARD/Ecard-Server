import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { hostConfig } from "src/common/configs";
import Mail from "src/common/templates/send-mail.template";
import { AuthService } from "./auth.service";
import { SendMailDto } from "./dto/send-mail.dto";

@Processor({name: 'email-queue'})
export class AuthConsumer {
    constructor (
        private readonly mail: Mail,
        private readonly authenService: AuthService
    ){}

    @Process('send-mail-register')
    async sendToRegister(job: Job<SendMailDto>) {
        await this.mail.sendTo(`${hostConfig.APP_URL}/auth/active-user?token=${job.data.linkApi}&email=${job.data.email}`,job.data.email,job.data.createdBy,job.data.template)
    }

    @Process('send-mail-forgot-password')
    async sendToForgotPassword(job: Job<SendMailDto>) {
        await this.mail.sendTo(`${hostConfig.APP_URL}/auth/verify-resetpass?token=${job.data.linkApi}&email=${job.data.email}`,job.data.email,job.data.createdBy,job.data.template)
    }

    @Process('send-otp-to-mail')
    async sendOtpToMail(job: Job<SendMailDto>) {
        
        await this.mail.sendOtpTo(job.data.otp, job.data.email, job.data.createdBy, job.data.template)

    }


    
}