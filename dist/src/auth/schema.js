"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetSchema = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true }
}, { timestamps: true });
exports.passwordResetSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiration: { type: Date, required: true }
}, { timestamps: true });
