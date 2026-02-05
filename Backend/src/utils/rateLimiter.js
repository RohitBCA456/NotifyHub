import { rateLimit } from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: { message: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, 
    message: { message: 'Security limit reached. Please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});