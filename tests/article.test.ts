import request from "supertest";
import app from "../src/app";

describe("Article Endpoints", () => {
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Author",
      email: "author@example.com",
      password: "StrongPass1!",
      role: "author",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "author@example.com",
      password: "StrongPass1!",
    });
    accessToken = res.body.Object.accessToken;
  });

  it("should create an article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Test Article",
        content:
          "This is a test article content with more than fifty characters.",
        category: "Tech",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
    articleId = res.body.Object.id;
  });

  it("should soft delete the article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
  });
});
