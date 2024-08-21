const Article = require("./articles.schema");

class ArticlesService {
  async create(articleData, userId) {
    const article = new Article({
      ...articleData,
      user: userId
    });
    return await article.save();
  }
  async update(id, articleData) {
    return await Article.findByIdAndUpdate(id, articleData, { new: true });
  }
  async delete(id) {
    return await Article.findByIdAndDelete(id);
  }
  async getArticlesByUserId(userId) {
    return await Article.find({ user: userId })
      .populate({
        path: 'user',
        select: '-password'
      })
      .exec();
  }
}
module.exports = new ArticlesService();
