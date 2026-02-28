import express from 'express';
import cors from 'cors';
import { BD_NAME } from './config/constants.js';

const app = express();
const PORT = process.env.PORT || 3000;