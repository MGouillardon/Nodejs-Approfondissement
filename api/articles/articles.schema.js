const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'published'],
      message: "{VALUE} is not supported"
    },
    default: 'draft',
    lowercase: true,
    trim: true
  }
});
let Article;
module.exports = Article = model("Article", articleSchema);
