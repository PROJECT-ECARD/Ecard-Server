require('dotenv').config()
export const configurations = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT, 10),
  appAddress: process.env.APP_ADDRESS,
  websiteURL: process.env.WEBSITE_URL,
  emailSupport: process.env.EMAIL_SUPPORT,
  adminPassword: process.env.ADMIN_PASSWORD,
  systemName: process.env.SYSTEM_NAME,
  rateLimitWindow: parseFloat(process.env.RATE_LIMIT_WINDOW),
  rateLimitMaxRquest: parseInt(process.env.RATE_LIMIT_MAX_REQUEST),
}

export const dbConfig = {
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
}

export const jwtConfigs = {
  secret: process.env.SECRETKEY,
  accessTokenExpiresInLogin: process.env.EXPIRESIN_LOGIN,
  accessTokenExpiresInRegister: process.env.EXPIRESIN_REGISTER,
  accessTokenExpiresInForgotPassword: process.env.EXPIRESIN_FORGOT_PASSWORD,
}

export const emailConfig = {
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_TRANSFER_LINK_REGISTER: process.env.EMAIL_TRANSFER_LINK_REGISTER,
  EMAIL_TRANSFER_LINK_FORGET_PASSWORD: process.env.EMAIL_TRANSFER_LINK_FORGET_PASSWORD
}

export const templateConfig = {
  TEMPLATE_REGISTER: process.env.TEMPLATE_REGISTER,
  TEMPLATE_FORGET_PASSWORD: process.env.TEMPLATE_FORGET_PASSWORD,
  TEMPLATE_OTP_RESET_PASSWORD: process.env.TEMPLATE_OTP_RESET_PASSWORD
}

export const subjectConfig = {
  SUBJECT_REGISTER: process.env.SUBJECT_REGISTER,
  SUBJECT_FORGET_PASSWORD: process.env.SUBJECT_FORGET_PASSWORD
}

export const hostConfig = {
  APP_URL: process.env.APP_URL
}

export const redisConfig = {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: <any> process.env.REDIS_PORT,
  REDIS_PASSWORD: <any> process.env.REDIS_PASSWORD,
  REDIS_CUSTOM_NAME: process.env.REDIS_CUSTOM_NAME,
  REDIS_AOF_ENABLED: process.env.REDIS_AOF_ENABLED
}

export const timeConfig = {
  EXPIRESIN_OTP_TIME: parseInt(<string>process.env.EXPIRESIN_OTP_TIME)
}