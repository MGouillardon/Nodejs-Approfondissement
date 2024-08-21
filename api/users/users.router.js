const express = require("express");
const usersController = require("./users.controller");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

router.get("/:userId/articles", usersController.getUserArticles);

router.use(authMiddleware);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);

module.exports = router;