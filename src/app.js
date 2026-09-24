require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openApiDocument = require('../resources/openapi.json');
const authRoutes = require('./routes/authRoutes');
const motorcycleRoutes = require('./routes/motorcycleRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/api-docs.json', (req, res) => res.status(200).json(openApiDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/motorcycles', motorcycleRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
