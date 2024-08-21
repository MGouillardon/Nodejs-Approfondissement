const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");

describe("Articles API", () => {
  let token;
  const USER_ID = "fake";
  const ADMIN_USER = {
    _id: USER_ID,
    name: "Admin User",
    email: "admin@test.com",
    role: "admin"
  };
  const MOCK_ARTICLE = {
    _id: "fake",
    title: "Test Article",
    content: "This is a test article",
    user: USER_ID,
    status: "draft"
  };
  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(ADMIN_USER, "findOne");
  });
  describe("POST /api/articles", () => {
    it("should create a new article", async () => {
      mockingoose(Article).toReturn(MOCK_ARTICLE, "save");
      const res = await request(app)
        .post("/api/articles")
        .set("x-access-token", token)
        .send({ title: "New Article", content: "Content of the new article" });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(MOCK_ARTICLE.title);
      expect(res.body.content).toBe(MOCK_ARTICLE.content);
    });
  });
  describe("PUT /api/articles/:id", () => {
    it("should update an existing article", async () => {
      const updatedArticle = { ...MOCK_ARTICLE, title: "Updated Title" };
      mockingoose(Article).toReturn(updatedArticle, "findOneAndUpdate");
      const res = await request(app)
        .put(`/api/articles/${MOCK_ARTICLE._id}`)
        .set("x-access-token", token)
        .send({ title: "Updated Title" });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Title");
    });
  });
  describe("DELETE /api/articles/:id", () => {
    it("should delete an existing article", async () => {
      mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndDelete");
      const res = await request(app)
        .delete(`/api/articles/${MOCK_ARTICLE._id}`)
        .set("x-access-token", token);

      expect(res.statusCode).toBe(204);
    });
  });
  afterEach(() => {
    mockingoose.resetAll();
  });
});
