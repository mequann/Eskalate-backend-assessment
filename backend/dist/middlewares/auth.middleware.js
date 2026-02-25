"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                Success: false,
                Message: 'Unauthorized',
                Object: null,
                Errors: ['No token provided']
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = { id: decoded.sub, role: decoded.role };
        next();
    }
    catch (error) {
        return res.status(401).json({
            Success: false,
            Message: 'Unauthorized',
            Object: null,
            Errors: ['Invalid or expired token']
        });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                Success: false,
                Message: 'Forbidden',
                Object: null,
                Errors: ['Insufficient permissions']
            });
        }
        next();
    };
};
exports.authorize = authorize;
