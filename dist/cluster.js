"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cluster_1 = __importDefault(require("node:cluster"));
const node_os_1 = __importDefault(require("node:os"));
if (node_cluster_1.default.isPrimary) {
    const cpusCount = node_os_1.default.cpus().length;
    console.log(`cpusCount - ${cpusCount}`);
    console.log(`Master ${process.pid} is running`);
}
if (node_cluster_1.default.isWorker) {
    node_cluster_1.default.on('exit', (worker) => {
    });
}
