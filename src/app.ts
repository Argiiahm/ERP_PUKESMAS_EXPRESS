import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './middlewares/morganMiddleware.js';

const app = express();

app.use(morganMiddleware);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

export default app;
