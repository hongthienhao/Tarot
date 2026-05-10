import catchAsync from '../utils/catchAsync.js';

/**
 * System health report controller.
 */
export const getHealth = catchAsync(async (req, res, next) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'success',
    data: {
      uptime: `${Math.floor(uptime)} seconds`,
      memory: {
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
  });
});
