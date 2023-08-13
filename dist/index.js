"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./src/server/routes");
const mongodb_1 = __importDefault(require("./src/database/mongodb"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5002;
(0, mongodb_1.default)();
(0, routes_1.createRoutes)()
    .then((routes) => {
    app.use(routes);
})
    .catch((err) => {
    console.log(err);
});
app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});
app.listen(port, () => {
    console.log(`Server ${host}:${port} is running`);
});
