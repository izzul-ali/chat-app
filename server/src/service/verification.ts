import { AuthRegister } from '../types/auth';
import { createTransport } from 'nodemailer';
import prisma from '../lib/prisma';
import bcr from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function sendRegisterEmailVerification(payload: AuthRegister) {
  const token = generateAccessToken(payload.email);
  const hashPassword = await bcr.hash(payload.password, 16);

  try {
    await prisma.verification.create({
      data: {
        email: payload.email,
        name: payload.name,
        password: hashPassword,
        token: token,
      },
    });
  } catch (error) {
    throw error;
  }

  const link = `${process.env.CLIENT_ORIGIN}/auth/verification/${token}`;

  const getTransport = createTransport({
    name: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const requestEmail = createMailOptions(payload.email, link);
  getTransport.sendMail(
    {
      from: requestEmail.from,
      to: requestEmail.to,
      sender: requestEmail.sender,
      html: requestEmail.body,
      subject: requestEmail.subject,
    },
    async (err, info) => {
      if (err) {
        console.log(err.message);

        await prisma.verification.deleteMany({ where: { email: payload.email } });
        throw err;
      }

      console.log(info.response);
    }
  );
}

function generateAccessToken(email: string) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('Failed to get jwt secret key');
  }
  const expirationDate = new Date();
  // NOTE: Change expiration time
  expirationDate.setMinutes(new Date().getMinutes() + 1);

  return jwt.sign({ email, expirationDate }, jwtSecret, { algorithm: 'HS256' });
}

function createMailOptions(email: string, link: string) {
  const body = `
  <h1>Hello ${email}</h1>
  <p>This is verification link to access my chat app</p>
  <p>Please click url bellow to confirm verification</p>
  <a href="${link}">Verification</a>
    `;

  return {
    body,
    subject: 'Verification Link',
    from: process.env.EMAIL_ADDRESS,
    sender: 'ChatApp by Izzul-Ali',
    to: email,
  };
}
