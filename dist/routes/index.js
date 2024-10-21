"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRequestListener = void 0;
const userRequestListener = (req, res) => {
    for (let i = 0; i < 1e8; i++) {
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
};
exports.userRequestListener = userRequestListener;
