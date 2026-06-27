import dotenv from 'dotenv';

dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { SERVER } from './constants';

const app: Application = express();

app.use(helmet());
app.use(cors({
  origin: SERVER.CLIENT_URL,
  credentials: true,
}));
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.use('/api', routes);

app.use(errorHandler);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
