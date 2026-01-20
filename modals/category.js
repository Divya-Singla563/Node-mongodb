const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    // subCategories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "subCategories",
    //   },
    // ],
  },
  { timestamps: true }
);

categorySchema.index({
  name: "text",
  description: "text",
});

module.exports.categories = mongoose.model("categories", categorySchema);
