const { mongoose } = require("mongoose");
const { subCategories } = require("../modals");

module.exports.addSubCategory = async (body) => {
  try {
    const { name, image, description, category } = body;

    const existingSubCate = await subCategories.findOne({ name }).lean();

    if (existingSubCate) {
      throw new Error("Sub-Category already exist with this name");
    }

    const newSubCate = await subCategories.create({
      name,
      image,
      description,
      category,
    });

    return {
      message: "Sub-Category added successfully",
      data: newSubCate,
    };
  } catch (error) {
    console.log("[JS] sub-category.js:4 - error:", error);
    throw error;
  }
};

module.exports.getAllSubCategory = async ({
  page = 1,
  limit = 10,
  search = "",
  category,
}) => {
  try {
    console.log("[JS] sub-category.js:34 - category:", category);
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    }

    const [data, total] = await Promise.all([
      subCategories
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("category", "name image description")
        .lean(),
      subCategories.countDocuments(query),
    ]);

    if (!data.length) {
      throw new Error("No categories");
    }
    return {
      message: "Data fetched successfully",
      data: {
        total,
        page,
        limit,
        data,
        totalPages: Math.ceil(total / page),
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getSubCategoryById = async (_id) => {
  try {
    const data = await subCategories
      .findOne({ _id })
      .populate("category", "name image description");
    return {
      message: "Data fetched successfully",
      data,
    };
  } catch (error) {
    console.log("[JS] sub-category.js:52 - error:", error);
    throw error;
  }
};

module.exports.deleteSubCategory = async (_id) => {
  try {
    const subCate = await subCategories.findById(_id);

    if (!subCate) {
      throw new Error("Sub-Category not found");
    }
    const deleted = await subCategories.findByIdAndDelete(_id);
    return {
      message: "Sub-Category deleted successfully",
      data: deleted,
    };
  } catch (error) {
    throw error;
  }
};

module.exports.updateSubCategoryByID = async (_id, body) => {
  const { name, description, image, category } = body;
  try {
    const subCategory = await subCategories.findById(_id);

    if (!subCategory) {
      throw new Error("Sub-Category not found");
    }

    const existingSubCategory = await subCategories.findOne({ name }).lean();
    if (existingSubCategory && existingSubCategory._id.toString() !== _id) {
      throw new Error("Sub-Category already exist with this name");
    }

    const updatedSubCategory = await subCategories
      .findByIdAndUpdate(
        _id,
        {
          name,
          description,
          image,
          category,
        },
        { new: true }
      )
      .populate("category");

    return {
      message: "Sub-Category updated successfully",
      data: updatedSubCategory,
    };
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};
