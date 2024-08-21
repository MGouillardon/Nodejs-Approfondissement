const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = await articlesService.create(req.body, req.user._id);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Only admins can update articles");
      }
      const id = req.params.id;
      const updatedArticle = await articlesService.update(id, req.body);
      if (!updatedArticle) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:update", updatedArticle);
      res.json(updatedArticle);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Only admins can delete articles");
      }
      const id = req.params.id;
      const deletedArticle = await articlesService.delete(id);
      if (!deletedArticle) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
