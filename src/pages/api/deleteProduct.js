import { connectToDatabase } from "../../lib/mongodb"; // Adjust path if needed
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const { db } = await connectToDatabase();
      const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Product deleted successfully." });
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
