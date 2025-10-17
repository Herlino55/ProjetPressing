import app from './app';
import { connectDB } from '../config/db.config';
import { Logger } from '../utils/logger';
import { SchedulerService } from '../services/scheduler.service';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      Logger.info(`Server is running on port ${PORT}`);
      Logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      Logger.info(`API Documentation: http://localhost:${PORT}/`);
    });
  } catch (error) {
    Logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

//rappels automatiques
// SchedulerService.startJobs();

process.on('unhandledRejection', (reason: any) => {
  Logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
