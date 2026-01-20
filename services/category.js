const { categories } = require("../modals");

module.exports.addCategory = async (data) => {
  try {
    const { name, description, image } = data;

    const existingCategory = await categories.findOne({ name }).lean();
    if (existingCategory) {
      throw new Error("Category already exist with this name");
    }

    const newCategory = await categories.create({
      name,
      description,
      image,
    });

    return {
      message: "Category added successfully",
      data: newCategory,
    };
  } catch (error) {
    console.log("error----: ", error);
    throw error;
  }
};

module.exports.getAllCategory = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  try {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const query = {};
    const sort = { createdAt: -1 };

    if (search) {
      query.$or = [
        // $or for at least one condition must match
        { name: { $regex: search, $options: "i" } }, // i for case sensitive
        { description: { $regex: search, $options: "i" } },
      ];

      // query.$text = { $search: search };
      // sort.score = { $meta: "textScore" };
    }

    // const projection = search ? { score: { $meta: "textScore" } } : {};

    const [data, total] = await Promise.all([
      categories.find(query).skip(skip).limit(limit).sort(sort).lean(),
      categories.countDocuments(query),
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
        categories: data,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getCategoryById = async (_id) => {
  try {
    const category = await categories.findById(_id).lean();
    if (!category) {
      throw new Error("Category not found");
    }

    return {
      message: "Data fetched successfully",
      data: category,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.updateCategoryByID = async (_id, body) => {
  const { name, description, image } = body;
  try {
    const category = await categories.findById(_id);

    if (!category) {
      throw new Error("Category not found");
    }

    const existingCategory = await categories.findOne({ name }).lean();
    if (existingCategory && existingCategory._id.toString() !== _id) {
      throw new Error("Category already exist with this name");
    }

    const updatedCategory = await categories.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        image,
      },
      { new: true }
    );

    return { message: "Category updated successfully", data: updatedCategory };
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};

module.exports.deleteCategory = async (_id) => {
  try {
    const category = await categories.findById(_id);

    if (!category) {
      throw new Error("Category not found");
    }

    const deleted = await categories.findByIdAndDelete(_id);

    return { message: "Category deleted successfully", data: deleted };
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};
