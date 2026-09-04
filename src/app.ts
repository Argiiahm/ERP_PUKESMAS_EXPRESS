import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './middlewares/morgan.middleware.js';
import Authroute from './routes/auth.route.js';
import UserRoute from './routes/user.route.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(morganMiddleware);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', Authroute);
app.use('/api/v1', UserRoute);

app.use(errorHandler);

export default app;
