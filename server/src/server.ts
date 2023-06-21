import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const client = process.env.CLIENT_ORIGIN;
const port = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: client,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE',
  })
);
app.use(express.json());

app.listen(parseInt(port!), 'localhost', () => console.log(`server running on http://localhost:${port}`));
