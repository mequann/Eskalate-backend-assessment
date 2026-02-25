import request from "supertest";
import app from "../src/app";

describe("Auth Endpoints", () => {
  it("should signup a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "StrongPass1!",
      role: "author",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
  });

  it("should not signup with duplicate email", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "StrongPass1!",
      role: "author",
    });
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "StrongPass1!",
      role: "author",
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.Success).toBe(false);
  });

  it("should login with valid credentials", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "loginuser@example.com",
      password: "StrongPass1!",
      role: "reader",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "loginuser@example.com",
      password: "StrongPass1!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
    expect(res.body.Object.accessToken).toBeDefined();
    expect(res.body.Object.refreshToken).toBeDefined();
  });
});
