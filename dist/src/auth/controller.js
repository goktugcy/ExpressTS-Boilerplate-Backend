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
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const model_1 = __importDefault(require("./model"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
exports.authService = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password } = req.body;
        try {
            const user = yield model_1.default.findOne({ username });
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
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new model_1.default({
                username,
                email,
                password: hashedPassword
            });
            yield newUser.save();
            return res.json({ message: 'User successfully created' });
        }
        catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Something went wrong', error });
        }
    })
};
