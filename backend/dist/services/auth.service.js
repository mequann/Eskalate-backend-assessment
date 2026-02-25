"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
exports.AuthService = {
    async signup(data) {
        const user = await user_model_1.UserModel.create(data);
        return user;
    },
    async login(data) {
        const user = await user_model_1.UserModel.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const validPassword = await (0, password_1.verifyPassword)(data.password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        const token = (0, jwt_1.generateToken)({
            sub: user.id,
            role: user.role
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
};
