"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import helmet from 'helmet';
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
// Security middleware
// app.use(helmet());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api", routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// Error handling
app.use(error_middleware_1.errorHandler);
// Start server
// Export app for testing and server startup
exports.default = app;
