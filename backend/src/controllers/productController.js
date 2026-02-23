const Product = require("../models/Product");

/**
 * GET /api/products
 * Query Params:
 * - category: "Electronics" OR "Electronics,Fashion"
 * - minPrice: number
 * - maxPrice: number
 * - sort: "price_asc" (required by task) | "price_desc" (optional)
 * - page: number (default 1)
 * - limit: number (default 12)
 */
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort = "price_asc",
      page = "1",
      limit = "12"
    } = req.query;

    // Convert pagination strings -> numbers
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50); // cap limit to 50
    const skip = (pageNum - 1) * limitNum;

    // Build MongoDB filter object (DB-level filtering)
    const filter = {};

    // Category filter: allow single or comma-separated list
    if (category) {
      const categories = category.split(",").map((c) => c.trim()).filter(Boolean);
      if (categories.length > 0) {
        filter.category = { $in: categories };
      }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && minPrice !== "") {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== "") {
        filter.price.$lte = Number(maxPrice);
      }
      // If user passed nonsense like minPrice="abc"
      if (Number.isNaN(filter.price.$gte)) delete filter.price.$gte;
      if (Number.isNaN(filter.price.$lte)) delete filter.price.$lte;

      // If price object became empty, remove it
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }

    // Sorting (DB-level sorting)
    let sortOption = { price: 1 }; // low-to-high default
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    // Query the database with filter + sort + pagination
    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      items,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
