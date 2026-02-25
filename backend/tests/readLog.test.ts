import request from "supertest";
import app from "../src/app";

describe("ReadLog Endpoints", () => {
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    const readerEmail = `reader_${Date.now()}@example.com`;
    await request(app).post("/api/auth/signup").send({
      name: "Reader",
      email: readerEmail,
      password: "StrongPass1!",
      role: "reader",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: readerEmail,
      password: "StrongPass1!",
    });
    accessToken = res.body.Object.token;
    // Create article as author
    const authorEmail = `author2_${Date.now()}@example.com`;
    await request(app).post("/api/auth/signup").send({
      name: "Author",
      email: authorEmail,
      password: "StrongPass1!",
      role: "author",
    });
    const authorRes = await request(app).post("/api/auth/login").send({
      email: authorEmail,
      password: "StrongPass1!",
    });
    const authorToken = authorRes.body.Object.token;
    const articleRes = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "ReadLog Article",
        content:
          "This is a test article content with more than fifty characters.",
        category: "Tech",
        status: "PUBLISHED",
      });
    articleId = articleRes.body.Object.id;
    // Ensure article exists before running tests
    const verifyRes = await request(app)
      .get(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${authorToken}`);
    if (verifyRes.statusCode !== 200) {
      throw new Error(
        `Article not found in setup: status ${verifyRes.statusCode}`,
      );
    }
  });

  it("should log a read for an article", async () => {
    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
  });
});
