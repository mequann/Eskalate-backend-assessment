"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
exports.AuthController = {
    async signup(req, res) {
        try {
            const user = await auth_service_1.AuthService.signup(req.body);
            return res.status(201).json((0, response_1.successResponse)(user, 'User created successfully'));
        }
        catch (error) {
            const status = error.statusCode || 400;
            return res.status(status).json((0, response_1.errorResponse)('Registration failed', [error.message]));
        }
    },
    async login(req, res) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            return res.json((0, response_1.successResponse)({ token: result.token }, 'Login successful'));
        }
        catch (error) {
            return res.status(401).json((0, response_1.errorResponse)('Invalid credentials', [error.message]));
        }
    }
};
