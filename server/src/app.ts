import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-role', 'x-admin-key', 'x-requested-with'],
  })
);
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'VANISETU REST API',
    mission: 'A digital bridge for tribal languages.',
    timestamp: new Date().toISOString(),
  });
});

// Mount modular API routes
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌿 VANISETU Backend Server running at http://localhost:${PORT}`);
    console.log(`📚 REST API endpoints available at http://localhost:${PORT}/api`);
  });
}

export default app;
