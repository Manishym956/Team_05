import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import axios from 'axios';
import winston from 'winston';

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`RAWG API Key: ${RAWG_API_KEY ? 'Configured' : 'Missing'}`);
  logger.info(`Twitch Client ID: ${TWITCH_CLIENT_ID ? 'Configured' : 'Missing'}`);
});