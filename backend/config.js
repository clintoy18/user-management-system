require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'node-mysql-signup-verification-apistart-final'
  },
  secret: process.env.JWT_SECRET || 'your-jwt-secret',
  emailFrom: process.env.EMAIL_FROM || 'your-email@example.com',
  smtpOptions: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER || 'your-smtp-user',
      pass: process.env.SMTP_PASS || 'your-smtp-password'
    }
  }
}; 