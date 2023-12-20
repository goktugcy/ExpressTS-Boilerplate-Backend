"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("./schema");
const User = mongoose_1.default.model('User', schema_1.userSchema);
exports.User = User;
const PasswordReset = mongoose_1.default.model('PasswordReset', schema_1.passwordResetSchema);
exports.PasswordReset = PasswordReset;
