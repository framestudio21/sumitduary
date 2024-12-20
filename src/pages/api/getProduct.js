// api/getproduct.js
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: true,
  },
};

const fetchProducts = async (db, currentProduct) => {
  const conditions = [
    {
      name: "prevProductItem",
      query: { createdAt: { $lt: currentProduct.createdAt } },
      sort: { createdAt: -1 },
    },
    {
      name: "nextProductItem",
      query: { createdAt: { $gt: currentProduct.createdAt } },
      sort: { createdAt: 1 },
    },
  ];

  const results = {};
  await Promise.all(
    conditions.map(async ({ name, query, sort }) => {
      results[name] = await db
        .collection("products")
        .find(query)
        .sort(sort)
        .limit(1)
        .toArray();
    })
  );
  return results;
};


// Function to fetch home page data
const fetchHomePageData = async (db, currentProduct) => {
  const [prevProductItem, nextProductItem] = await Promise.all([
    db
      .collection("products")
      .find({ type: "product", createdAt: { $lt: currentProduct.createdAt }  })  // Fixed the condition here
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray(),
    db
      .collection("products")
      .find({ type: "product", createdAt: { $gt: currentProduct.createdAt }  })  // Fixed the condition here
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray(),
  ]);

  const [cardPrevProduct, cardNextProduct] = await Promise.all([
    db
      .collection("products")
      .find({ type: "product", createdAt: { $lt: currentProduct.createdAt } })  // Fixed the condition here
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray(),
    db
      .collection("products")
      .find({ type: "product", createdAt: { $gt: currentProduct.createdAt } })  // Fixed the condition here
      .sort({ createdAt: 1 })
      .limit(2)
      .toArray(),
  ]);

  const relatedProducts = await db
    .collection("products")
    .find({})
    .sort({ createdAt: 1 })
    .toArray();

  return {
    prevProductItem: prevProductItem,
    nextProductItem: nextProductItem,
    cardPrevProduct: cardPrevProduct,
    cardNextProduct: cardNextProduct,
    relatedProducts,
  };
};


// Function to fetch admin page data
const fetchAdminPageData = async (db, currentProduct) => {
  const [adminPrevProductItem, adminNextProductItem] = await Promise.all([
    db
      .collection("products")
      .find({ createdAt: { $lt: currentProduct.createdAt } })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray(),
    db
      .collection("products")
      .find({ createdAt: { $gt: currentProduct.createdAt } })
      .sort({ createdAt: 1 })
      .limit(1)
      .toArray(),
  ]);

  const [adminCardPrevProduct, adminCardNextProduct] = await Promise.all([
    db
      .collection("products")
      .find({ createdAt: { $lt: currentProduct.createdAt } })
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray(),
    db
      .collection("products")
      .find({ createdAt: { $gt: currentProduct.createdAt } })
      .sort({ createdAt: 1 })
      .limit(2)
      .toArray(),
  ]);

  return {
    adminPrevProductItem: adminPrevProductItem,
    adminNextProductItem: adminNextProductItem,
    adminCardPrevProduct: adminCardPrevProduct,
    adminCardNextProduct: adminCardNextProduct,
  };
};

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const { productId, specialID } = req.query;

    if (productId || specialID) {
      const query = {
        ...(productId && { _id: new ObjectId(productId) }),
        ...(specialID && { specialID }),
      };

      const currentProduct = await db.collection("products").findOne(query);
      if (!currentProduct)
        return res.status(404).json({ message: "Product not found." });
      const productData = await fetchProducts(db, currentProduct);
      

      // Fetch home and admin data separately
      const homeData = await fetchHomePageData(db, currentProduct);
      const adminData = await fetchAdminPageData(db, currentProduct);

      return res.status(200).json({
        currentProduct,
        ...productData,

        // Home page data
        prevProductItem: homeData.prevProductItem[0] || null,
        nextProductItem: homeData.nextProductItem[0] || null,
        cardPrevProduct: homeData.cardPrevProduct,
        cardNextProduct: homeData.cardNextProduct,
        // relatedProducts: homeData.relatedProducts,

        // Admin page data
        adminPrevProductItem: adminData.adminPrevProductItem[0] || null,
        adminNextProductItem: adminData.adminNextProductItem[0] || null,
        adminCardPrevProduct: adminData.adminCardPrevProduct,
        adminCardNextProduct: adminData.adminCardNextProduct,
      });
    }

    

    const allProducts = await db.collection("products").find({}).toArray();
    return res.status(200).json({ products: allProducts });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product.", error: error.message });
  }
};

export default handler;
