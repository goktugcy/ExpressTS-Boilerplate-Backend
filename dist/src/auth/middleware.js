"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidation = exports.authenticateMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_validator_1 = require("express-validator");
const authenticateMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    dotenv_1.default.config();
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.body.user = decodedToken;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    next();
};
exports.authenticateMiddleware = authenticateMiddleware;
exports.registerValidation = [
    (0, express_validator_1.body)('username').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('phone').isNumeric().withMessage('Phone number must be numeric')
];
