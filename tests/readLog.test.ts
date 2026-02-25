import request from "supertest";
import app from "../src/app";

describe("ReadLog Endpoints", () => {
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Reader",
      email: "reader@example.com",
      password: "StrongPass1!",
      role: "reader",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "reader@example.com",
      password: "StrongPass1!",
    });
    accessToken = res.body.Object.accessToken;
    // Create article as author
    await request(app).post("/api/auth/signup").send({
      name: "Author",
      email: "author2@example.com",
      password: "StrongPass1!",
      role: "author",
    });
    const authorRes = await request(app).post("/api/auth/login").send({
      email: "author2@example.com",
      password: "StrongPass1!",
    });
    const authorToken = authorRes.body.Object.accessToken;
    const articleRes = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "ReadLog Article",
        content:
          "This is a test article content with more than fifty characters.",
        category: "Tech",
      });
    articleId = articleRes.body.Object.id;
  });

  it("should log a read for an article", async () => {
    const res = await request(app)
      .get(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
  });
});
