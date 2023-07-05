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
<!DOCTYPE html>
<html lang="en">
  <head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Verify | Chat App</title>
  <style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  } 
  
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 35px;
  }
  
  .desc {
    font-size: 15px;
  }
  
  .btn-link {
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    padding: 5px 28px;
    border: none;
    border-radius: 3px;
    background-color: rgb(23, 139, 255);
    color: azure;
    cursor: pointer;
    transition: all;
    transition-duration: 0.2s;
  }
  
  .btn-link:hover {
    background-color: rgb(0, 128, 255);
  }
  
  .separate {
    width: 0px;
    padding: 1px 20px;
    display: block;
    border: none;
    border-radius: 5px;
    background-color: rgb(228, 228, 228);
    margin-top: 40px;
  }
  
  .author {
    margin-top: 10px;
    font-weight: 600;
    color: rgb(194, 194, 194);
  }
  </style>
  </head>

  <body>
      <h1 class="title">Signin Verification for Chat App</h1>
      <a href='${link}' target='_blank' rel='noreferrer' class="btn-link">verify</a>
      <p class="desc">Hello , This link only be valid for the next 5 minutes.</p>

      <span class="separate"></span>
      <p class="author">Izzul</p>
  </body>
</html>
    `;

  return {
    body,
    subject: 'Verification Link',
    from: process.env.EMAIL_ADDRESS,
    sender: 'ChatApp by Izzul-Ali',
    to: email,
  };
}
