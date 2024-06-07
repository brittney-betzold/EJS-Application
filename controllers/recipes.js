const Recipe = require("../models/Recipe");

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user._id });
    res.render("recipes", { recipes, csrfToken: req.csrfToken() });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.showAddRecipeForm = (req, res) => {
  res.render("recipe", { recipe: null, csrfToken: req.csrfToken() });
};

exports.showEditRecipeForm = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.render("recipe", { recipe, csrfToken: req.csrfToken() });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe({ ...req.body, createdBy: req.user._id });
    await newRecipe.save();
    res.redirect("/recipes");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return res.status(404).send("Recipe not found");
    }
    res.redirect("/recipes");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    console.log("Delete route hit"); // Ensure this log is visible
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!recipe) {
      console.log("Recipe not found");
      return res.status(404).send("Recipe not found");
    }
    console.log("Recipe deleted");
    res.redirect("/recipes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
