/**
 * @fileoverview Main server file for the healthcare system
 * @module index
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { swaggerUi, swaggerSpec } = require('./config/swagger');

const app = express();

// Middleware
// Disable helmet CSP for swagger-ui assets
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'NeoClinic API Documentation',
  explorer: true
}));

// OpenAPI JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Root route: Redirect browser to /api-docs or provide JSON info
app.get('/', (req, res) => {
  res.format({
    'text/html': () => res.redirect('/api-docs'),
    'application/json': () => res.json({
      status: 'online',
      message: 'NeoClinic Healthcare Management API',
      documentation: '/api-docs',
      version: '1.0.0'
    }),
    default: () => res.redirect('/api-docs')
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medical-records', require('./routes/medical-records'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/health-parameters', require('./routes/health-parameters'));
app.use('/api/notifications', require('./routes/notifications'));
const testResultsRoutes = require('./routes/test-results');
app.use('/api/test-results', testResultsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
