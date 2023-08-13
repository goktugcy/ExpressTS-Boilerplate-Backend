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
exports.createRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../auth/controller");
const controller_2 = require("../blog/controller");
const middleware_1 = require("../auth/middleware");
const createRoutes = () => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.default.Router();
    // Auth routes
    router.post('/login', controller_1.authService.login);
    router.post('/register', controller_1.authService.register);
    router.post('/forgot-password', controller_1.authService.forgotPassword);
    router.post('/reset-password', controller_1.authService.resetPassword);
    router.get('/blogs', controller_2.blogService.blog);
    router.get('/blogs/:id', controller_2.blogService.show);
    router.post('/blogs', middleware_1.authenticateMiddleware, controller_2.blogService.create);
    router.put('/blogs/:id', middleware_1.authenticateMiddleware, controller_2.blogService.update);
    router.delete('/blogs/:id', middleware_1.authenticateMiddleware, controller_2.blogService.destroy);
    return router;
});
exports.createRoutes = createRoutes;
