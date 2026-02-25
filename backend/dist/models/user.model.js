"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
exports.UserModel = {
    async create(data) {
        const existing = await database_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existing) {
            const error = new Error('Email already exists');
            error.statusCode = 409;
            throw error;
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        return database_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
    },
    async findByEmail(email) {
        return database_1.prisma.user.findUnique({ where: { email } });
    },
    async findById(id) {
        return database_1.prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true }
        });
    }
};
