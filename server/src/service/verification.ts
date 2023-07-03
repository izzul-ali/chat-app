import { createTransport } from 'nodemailer';
import { generateAccessToken } from './token';
import prisma from '../lib/prisma';

export default async function sendRegisterEmailVerification(userEmail: string, isRegistered: boolean) {
  const token = generateAccessToken(userEmail);

  try {
    await prisma.verification.create({
      data: {
        email: userEmail,
        token: token,
        isRegister: isRegistered,
      },
    });
  } catch (error) {
    throw error;
  }

  const link = `${process.env.CLIENT_ORIGIN}/auth/verify/${userEmail}/${token}`;

  const getTransport = createTransport({
    name: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const requestEmail = createMailOptions(userEmail, link);
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

        await prisma.verification.deleteMany({ where: { email: userEmail } });
        throw err;
      }

      console.log(info.response);
    }
  );
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
