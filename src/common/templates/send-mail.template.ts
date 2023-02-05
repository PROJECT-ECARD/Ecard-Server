import { emailConfig, subjectConfig } from "../configs"
import * as nodemailer from 'nodemailer'

class Mail {
    async sendOtpTo(otp, email, name, template){
        const HTML_TEMPLATE = {
            templateOtpResetPassword:`
            <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
            <title>XÁC THỰC TÀI KHOẢN</title>
        </head>
        <body style=" style="color: #212529;font-family: Arial, Helvetica, sans-serif;color: #212529;">
            <header class="container-fluid" style="background-color: #F5F5F5; text-align: center;">
                <img src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/305652054_603762128205220_2993638612314882345_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_ohc=l_23B3ShyeIAX_FjBGS&_nc_ht=scontent.fsgn8-4.fna&oh=03_AdRWYvtd2TaUZlVLTrXwfu-ZmX5o0_jlyecPI6tf-hi_pQ&oe=638FC036" alt="logo">
            </header>
            <main style="color: #212529;">
                <br />
                <div style="padding-bottom:20px">
                    <div style="color: #212529; text-align: center; font-weight: bold; font-size: 28px; ">
                        Xác Nhận Quên Mật Khẩu
                    </div>
                    <br>
                    <div style="color:#212529;width: 600px; margin: auto; text-align: justify; font-size: 16px;">
                        Xin chào: <p style="display: inline; font-weight: bold">${ name }</p> <br><br>
                        Anh/Chị đã quên mật khẩu. Xin vui lòng nhập mã OTP này <p style="display: inline; font-weight: bold;">${otp}</p> vào ứng dụng để được cấp lại mật khẩu mới <br> <br>
                        Nếu Anh/Chị có thắc mắc hãy liên hệ ngay Hotline (+84) 8 1949 0540 để được hỗ trợ nhanh nhất. <br><br>
                        Thân mến, chúc Anh/Chị một ngày tốt lành <br>
                        <p style="display: inline; font-weight: bold;">Ecard</p>
                        <hr style="margin-top: 30px;margin-bottom: 40px;"/>
                    </div>
                </div>
            </main>
            <div class="container-fluid" style="background-color: #F5F5F5; text-align: center; padding:20px">
                
                (+84) 8 1949 0540 <br>
                info@vndigitech.com <br>
                VP: Tòa nhà SBI, Lô 6B, ĐS 03, QTSC, P. Tân Cánh Hiệp, Q.12, TP.HCM <br>
                Trụ sở: E9, A2, KDC Tín Phong, P. Tân Thới Nhất, Q 12, TP.HCM <br><br>
                Copyright @ 2022 Ecard All rights reserved <br>
                Contact email: dev10.vndigitech@gmail.com <br>
            </div>
          </body>
        </html>
        `,
        }

        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
            user: emailConfig.EMAIL_HOST,
            pass: emailConfig.EMAIL_PASS,
            }
        })
      
        let mailOption
        
        /**
         * template = 1: form xác thực tài khoản
         * template = 2: form xác thực quên mật khẩu
         * template = 3: form gửi mã otp quên mật khẩu
         */
        if(template === 3){
            mailOption = {
                from: emailConfig.EMAIL_HOST,
                to: email,
                subject: subjectConfig.SUBJECT_REGISTER,
                html: HTML_TEMPLATE.templateOtpResetPassword
            }
        }
        
      
        await transporter.sendMail(mailOption, (err, data) => {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('email sent');
            }
        })
    }

    async sendTo(linkApi,email,name,template){        
        const HTML_TEMPLATE = {
          templateRegister:`
          <html>
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
          <title>XÁC THỰC TÀI KHOẢN</title>
      </head>
      <body style=" font-family: Arial, Helvetica, sans-serif;color: #212529;">
          <header class="container-fluid" style="background-color: #F5F5F5; text-align: center;">
              <img src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/305652054_603762128205220_2993638612314882345_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_ohc=l_23B3ShyeIAX_FjBGS&_nc_ht=scontent.fsgn8-4.fna&oh=03_AdRWYvtd2TaUZlVLTrXwfu-ZmX5o0_jlyecPI6tf-hi_pQ&oe=638FC036" alt="logo">
          </header>
          <main style="color: #212529;">
              <br />
              <div style="padding-bottom:20px">
                  <div style="color: #212529;text-align: center; font-weight: bold; font-size: 28px; ">
                      XÁC NHẬN KÍCH HOẠT TÀI KHOẢN
                  </div>
                  <br>
                  <div style="color: #212529;width: 600px; margin: auto; text-align: justify; font-size: 16px;">
                      Xin chào: <p style="display: inline; font-weight: bold">${ name }</p> <br><br>
                      Anh/Chị đã đăng ký tài khoản thành công. Vui lòng nhấn nút <p style="display: inline; font-weight: bold;">"Xác nhận"</p> để được kích hoạt tài khoản. <br> <br>
                      Nếu Anh/Chị có thắc mắc hãy liên hệ ngay Hotline (+84) 8 1949 0540 để được hỗ trợ nhanh nhất. <br><br>
                      Thân mến, chúc Anh/Chị một ngày tốt lành <br>
                      <p style="display: inline; font-weight: bold;">Ecard</p>
                      <hr style="margin-top: 30px;margin-bottom: 40px;"/>
                  </div>
                  <div  style="text-align: center;margin-top: 20px;margin-bottom: 20px;">
                      <a style="border-radius: 5px;font-weight: 600;padding: 18px;background-color: #212529;font-size:18px;color: #fff;text-decoration: none;cursor: pointer;" href="${ linkApi }">Xác nhận</a>
                  </div>
              </div>
          </main>
          <div class="container-fluid" style="background-color: #F5F5F5; text-align: center;padding:20px">
            
              (+84) 8 1949 0540 <br>
              info@vndigitech.com <br>
              VP: Tòa nhà SBI, Lô 6B, ĐS 03, QTSC, P. Tân Cánh Hiệp, Q.12, TP.HCM <br>
              Trụ sở: E9, A2, KDC Tín Phong, P. Tân Thới Nhất, Q 12, TP.HCM <br><br>
              Copyright @ 2022 Ecard All rights reserved <br>
              Contact email: dev10.vndigitech@gmail.com <br>
          </div>
        </body>
      </html>
          `,
          templateVerifyForgotPassword:`
          <html>
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
          <title>XÁC THỰC TÀI KHOẢN</title>
      </head>
      <body style=" style="color: #212529;font-family: Arial, Helvetica, sans-serif;color: #212529;">
          <header class="container-fluid" style="background-color: #F5F5F5; text-align: center;">
              <img src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/305652054_603762128205220_2993638612314882345_n.png?_nc_cat=108&ccb=1-7&_nc_sid=ae9488&_nc_ohc=l_23B3ShyeIAX_FjBGS&_nc_ht=scontent.fsgn8-4.fna&oh=03_AdRWYvtd2TaUZlVLTrXwfu-ZmX5o0_jlyecPI6tf-hi_pQ&oe=638FC036" alt="logo">
          </header>
          <main style="color: #212529;">
              <br />
              <div style="padding-bottom:20px">
                  <div style="color: #212529; text-align: center; font-weight: bold; font-size: 28px; ">
                      Xác Nhận Quên Mật Khẩu
                  </div>
                  <br>
                  <div style="color:#212529;width: 600px; margin: auto; text-align: justify; font-size: 16px;">
                      Xin chào: <p style="display: inline; font-weight: bold">${ name }</p> <br><br>
                      Anh/Chị đã quên mật khẩu. Xin vui lòng nhấn nút<p style="display: inline; font-weight: bold;">"Xác nhận"</p> để được cấp lại mật khẩu mới <br> <br>
                      Nếu Anh/Chị có thắc mắc hãy liên hệ ngay Hotline (+84) 8 1949 0540 để được hỗ trợ nhanh nhất. <br><br>
                      Thân mến, chúc Anh/Chị một ngày tốt lành <br>
                      <p style="display: inline; font-weight: bold;">Ecard</p>
                      <hr style="margin-top: 30px;margin-bottom: 40px;"/>
                  </div>
                  <div  style="text-align: center;margin-top: 20px;margin-bottom: 20px;">
                      <a style="border-radius: 5px;font-weight: 600;padding: 18px;background-color: #212529;font-size:18px;color: #fff;text-decoration: none;cursor: pointer;" href="${ linkApi }">Xác nhận</a>
                  </div>
              </div>
          </main>
          <div class="container-fluid" style="background-color: #F5F5F5; text-align: center; padding:20px">
              
              (+84) 8 1949 0540 <br>
              info@vndigitech.com <br>
              VP: Tòa nhà SBI, Lô 6B, ĐS 03, QTSC, P. Tân Cánh Hiệp, Q.12, TP.HCM <br>
              Trụ sở: E9, A2, KDC Tín Phong, P. Tân Thới Nhất, Q 12, TP.HCM <br><br>
              Copyright @ 2022 Ecard All rights reserved <br>
              Contact email: dev10.vndigitech@gmail.com <br>
          </div>
        </body>
      </html>
      `,
        }
      
      
        let transporter = await nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
            user: emailConfig.EMAIL_HOST,
            pass: emailConfig.EMAIL_PASS,
            }
        })
      
        let mailOption
        
        /**
         * template = 1: form xác thực tài khoản
         * template = 2: form xác thực quên mật khẩu
         */
        if(template === 1){
            mailOption = {
                from: emailConfig.EMAIL_HOST,
                to: email,
                subject: subjectConfig.SUBJECT_REGISTER,
                html: HTML_TEMPLATE.templateRegister
            }
        }else if(template === 2){
            mailOption = {
                from: emailConfig.EMAIL_HOST,
                to: email,
                subject: subjectConfig.SUBJECT_FORGET_PASSWORD,
                html: HTML_TEMPLATE.templateVerifyForgotPassword,
            }
        }
      
        await transporter.sendMail(mailOption, (err, data) => {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('email sent');
            }
        })
    }   
}

export default Mail