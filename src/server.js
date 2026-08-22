import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();

app.use(express.json());
app.use(logger);
app.use(cors());

app.use(notesRouter);

app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
