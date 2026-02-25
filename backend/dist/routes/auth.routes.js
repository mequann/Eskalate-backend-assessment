"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
router.post('/signup', (0, validation_middleware_1.validate)(user_validator_1.signupSchema), auth_controller_1.AuthController.signup);
router.post('/login', (0, validation_middleware_1.validate)(user_validator_1.loginSchema), auth_controller_1.AuthController.login);
exports.default = router;
