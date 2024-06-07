const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipes");
const authMiddleware = require("../middleware/auth");

router.get("/", authMiddleware, recipesController.getAllRecipes);
router.get("/new", authMiddleware, recipesController.showAddRecipeForm);
router.get("/:id/edit", authMiddleware, recipesController.showEditRecipeForm);
router.post("/", authMiddleware, recipesController.createRecipe);
router.put("/:id", authMiddleware, recipesController.updateRecipe);
router.delete("/:id", authMiddleware, recipesController.deleteRecipe);

module.exports = router;
