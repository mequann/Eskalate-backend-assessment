"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatedResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message = 'Success') => ({
    Success: true,
    Message: message,
    Object: data,
    Errors: null
});
exports.successResponse = successResponse;
const errorResponse = (message, errors = []) => ({
    Success: false,
    Message: message,
    Object: null,
    Errors: errors
});
exports.errorResponse = errorResponse;
const paginatedResponse = (data, page, pageSize, total, message = 'Success') => ({
    Success: true,
    Message: message,
    Object: data,
    PageNumber: page,
    PageSize: pageSize,
    TotalSize: total,
    Errors: null
});
exports.paginatedResponse = paginatedResponse;
