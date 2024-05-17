const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeName: {
      type: String,
      required: [true, "Please provide a recipe name"],
      maxlength: 100,
    },
    instructions: {
      type: String,
      required: [true, "Please provide instructions for the recipe"],
    },
    ingredients: [
      {
        ingredientName: {
          type: String,
          required: [true, "Please provide an ingredient name"],
        },
        quantity: {
          type: String,
          required: [true, "Please provide the quantity"],
        },
      },
    ],
    cookingTime: {
      type: Number,
      required: [true, "Please provide cooking time (in minutes)"],
    },
    servingSize: {
      type: Number,
      required: [true, "Please provide the serving size"],
    },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "dessert"],
      required: [true, "Please select a category for the recipe"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
