"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const env_1 = require("../config/env");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        Success: false,
        Message: err.message || 'Internal server error',
        Object: null,
        Errors: env_1.env.NODE_ENV === 'development' ? [err.stack] : []
    });
};
exports.errorHandler = errorHandler;
