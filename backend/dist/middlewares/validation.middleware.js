"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                Success: false,
                Message: 'Validation failed',
                Object: null,
                Errors: error.errors?.map((e) => e.message) || ['Invalid input']
            });
        }
    };
};
exports.validate = validate;
