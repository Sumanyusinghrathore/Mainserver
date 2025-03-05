const { client } = require("../config/database");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// Fetch all products
// Fetch all products
async function getAllProducts(req, res) {
  try {
    const { category } = req.query; // Extract 'category' from query parameters
    const database = client.db("sample_mflix");
    const collection = database.collection("products");

    let query = {};

    if (category) {
      // Split category string into an array for multiple values (e.g., "Jaipuri,Chikankari")
      const categories = category.split(",").map((cat) => cat.trim());
      
      // Check if multiple categories or a single category
      if (categories.length > 1) {
        query = { category: { $in: categories } };
      } else {
        query = { category: categories[0] };
      }
    }

    // Fetch filtered products from the collection
    const products = await collection.find(query).toArray();

    // Return the filtered products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getSubCatogoryProducts(req, res) {
  try {
    const { subCategory } = req.query; // Extract 'subCategory' from query parameters
    const database = client.db("sample_mflix");
    const collection = database.collection("products");

    let query = {};
    if (subCategory) {
      
      // Split subCategory string into an array for multiple values (e.g., "Jaipuri,Chikankari")
      const categories = subCategory.split(",").map((cat) => cat.trim());
      
      // Check if multiple categories or a single subCategory
      if (categories.length > 1) {
        query = { subCategory: { $in: categories } };
      } else {
        query = { subCategory: categories[0] };
      }
    }

    // Fetch filtered products from the collection
    const products = await collection.find(query).toArray();

    // Return the filtered products
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


// Delete a product by ID
async function deleteProduct(req, res) {
  try {
    const { id } = req.params; // Extract the product ID from the request parameters
    const database = client.db("sample_mflix");
    const collection = database.collection("products");

    // Ensure valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add a Product user
async function addProduct(req, res) {
  try {
    const {
      title,
      price,
      design,
      availability,
      fabric,
      neckline,
      sleeve,
      pattern,
      material,
      occasion,
      quantity,
      washcare,
      metaTitle,
      metaDescription,
      category,
      colors = [],
      sizes = [],
      subCategory = [],
      metaImage = "",
      images = [],
    } = req.body;

    // Parsing colors, sizes, and subCategory, in case they are passed as strings in a list
    // However, you can avoid parsing them if they are already arrays in the request
    const parsedColors = Array.isArray(colors) ? colors : JSON.parse(colors || '[]');
    const parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes || '[]');
    const parsedSubCategory = Array.isArray(subCategory) ? subCategory : JSON.parse(subCategory || '[]');

    // Assuming images are being sent as an array of paths or base64 data from client-side
    const uploadedImages =
      req.files && req.files.length > 0
        ? req.files.map(file => ({
            file: file.originalname || "", // Use the uploaded file's name
            path: file.path || "", // Use the file's path
          }))
        : images.map((image, index) => ({
            file: image?.file || "",
            alt: image?.alt || `Image ${index + 1}`, // Provide a default alt text if missing
          }));

    // If metaImage is an image URL, ensure it's a string, or use an empty string
    const finalMetaImage = metaImage || "";

    // Database insertion
    const database = client.db("sample_mflix");
    const collection = database.collection("products");

    const newProduct = {
      title,
      price: parseFloat(price) || 0,
      design: design || "",
      colors: parsedColors,
      sizes: parsedSizes,
      category,
      subCategory: parsedSubCategory,
      availability,
      fabric,
      neckline,
      sleeve,
      pattern,
      material,
      occasion,
      quantity: parseInt(quantity, 10) || 0,
      washcare,
      metaTitle,
      metaDescription,
      metaImage: finalMetaImage,
      images: uploadedImages,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    res.status(201).json({
      message: "Product added successfully",
      product: { ...newProduct, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



async function updateProduct(req, res) {
  try {
      const { id } = req.params;
      const {
          title,
          price,
          colors,
          sizes,
          images,
      } = req.body;
      
      const database = client.db("sample_mflix");
      const collection = database.collection("products");

      // Ensure valid ObjectId
      if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid product ID" });
      }

      const updatedProduct = {
          ...(title && { title }),
          ...(price && { price: parseFloat(price) }),
          ...(colors && { colors }),
          ...(sizes && { sizes }),
          ...(images && { images }),
          updatedAt: new Date(),
      };

      const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedProduct }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getAllProducts, addProduct, deleteProduct, updateProduct, getSubCatogoryProducts };
