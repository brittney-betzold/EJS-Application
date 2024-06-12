const Recipe = require("../models/Recipe");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id });
    res.render("recipes", { recipes, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res
      .status(500)
      .send(
        "An error occurred while fetching recipes. Please try again later."
      );
  }
};

exports.showAddRecipeForm = (req, res) => {
  res.render("recipe", { recipe: null, csrfToken: req.csrfToken() });
};

exports.showEditRecipeForm = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid recipe ID");
    }

    const recipe = await Recipe.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!recipe) {
      return res
        .status(404)
        .send(
          "Recipe not found. It may have been deleted or you may not have permission to edit it."
        );
    }
    res.render("recipe", { recipe, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error("Error fetching recipe for editing:", err);
    res
      .status(500)
      .send(
        "An error occurred while fetching the recipe. Please try again later."
      );
  }
};

exports.createRecipe = async (req, res) => {
  try {
    await Recipe.create({ ...req.body, createdBy: req.user._id });
    res.redirect("/recipes");
  } catch (err) {
    console.error("Error creating recipe:", err);
    res
      .status(500)
      .send(
        "An error occurred while creating the recipe. Please try again later."
      );
  }
};

exports.updateRecipe = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid recipe ID");
  }

  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    recipe.set(req.body);
    const updatedRecipe = await recipe.save();

    res.redirect("/recipes");
  } catch (err) {
    console.error("Error updating recipe:", err);

    if (err.name === "ValidationError") {
      return res.status(400).send(err.message);
    }
    res
      .status(500)
      .send(
        "An error occurred while updating the recipe. Please try again later."
      );
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    console.log("Delete route hit");

    const recipe = await Recipe.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!recipe) {
      console.log("Recipe not found");
      return res
        .status(404)
        .send("Recipe not found or you don't have permission to delete it.");
    }

    await recipe.remove();
    console.log("Recipe deleted");
    res.redirect("/recipes");
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res
      .status(500)
      .send(
        "An error occurred while deleting the recipe. Please try again later."
      );
  }
};
