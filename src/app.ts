
import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { scheduleAnalyticsJob } from './jobs/analytics.job';
import { env } from './config/env';

const app = express();

// Security middleware
// app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  
  // Start job scheduler
  scheduleAnalyticsJob();
});