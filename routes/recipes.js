const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipes");
const authMiddleware = require("../middleware/auth");
const csrfProtection = require("../middleware/csrfProtection");

router.get("/", authMiddleware, recipesController.getAllRecipes);
router.get("/new", authMiddleware, recipesController.showAddRecipeForm);
router.get("/:id/edit", authMiddleware, recipesController.showEditRecipeForm);

// Add csrfProtection to the routes that modify data
router.post(
  "/",
  authMiddleware,
  csrfProtection,
  recipesController.createRecipe
);
router.put(
  "/:id",
  authMiddleware,
  csrfProtection,
  recipesController.updateRecipe
);
router.delete(
  "/:id",
  authMiddleware,
  csrfProtection,
  recipesController.deleteRecipe
);

module.exports = router;
