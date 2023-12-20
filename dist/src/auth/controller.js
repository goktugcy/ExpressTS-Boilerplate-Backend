"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.registerValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const model_1 = require("./model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mongodb_1 = require("mongodb");
const express_validator_1 = require("express-validator");
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
exports.registerValidation = [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('phone').isMobilePhone('tr-TR').withMessage('Phone number is required')
];
class AuthService {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            try {
                const user = yield model_1.User.findOne({ username });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Wrong password' });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
                res.json({ token });
            }
            catch (error) {
                res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { username, email, password, phone } = req.body;
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = new model_1.User({
                    username,
                    email,
                    password: hashedPassword,
                    phone
                });
                yield newUser.save();
                return res.json({ message: 'User successfully created' });
            }
            catch (error) {
                if (error instanceof mongodb_1.MongoError && error.code === 11000) {
                    return res.status(400).json({ message: 'User already registered' });
                }
                console.error('Error creating user:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const user = yield model_1.User.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                const resetToken = generateResetToken();
                const passwordReset = new model_1.PasswordReset({
                    email,
                    token: resetToken,
                    expiration: new Date(Date.now() + 3600000) // 1 saat
                });
                yield passwordReset.save();
                sendPasswordResetEmail(email, resetToken);
                return res.json({ message: 'Password reset email sent' });
            }
            catch (error) {
                console.error('Error sending password reset email:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, token, newPassword } = req.body;
            try {
                const passwordReset = yield model_1.PasswordReset.findOne({
                    email,
                    token,
                    expiration: { $gt: new Date() }
                });
                if (!passwordReset) {
                    return res.status(400).json({ message: 'Invalid reset token or token expired' });
                }
                const user = yield model_1.User.findOne({ email });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                user.password = yield bcrypt_1.default.hash(newPassword, 10);
                yield user.save();
                yield passwordReset.deleteOne();
                return res.json({ message: 'Password reset successful' });
            }
            catch (error) {
                console.error('Error resetting password:', error);
                return res.status(500).json({ message: 'Something went wrong', error });
            }
        });
    }
}
function generateResetToken() {
    const tokenLength = 40;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    return token;
}
exports.authService = new AuthService();
function sendPasswordResetEmail(email, resetToken) {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${process.env.APP_URL}/reset-password?token=${resetToken}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending password reset email:', error);
        }
        else {
            console.log('Password reset email sent:', info);
        }
    });
}
