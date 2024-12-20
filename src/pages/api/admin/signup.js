import { connectToDatabase } from "@/lib/mongodb"; // Use your MongoDB connection utility
import bcrypt from "bcryptjs"; // For password hashing

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      // Connect to MongoDB
      const { db } = await connectToDatabase();

      // Check if the user already exists
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user document
      const newUser = {
        email,
        password: hashedPassword,
        createdAt: new Date(),
      };

      // Insert the user into the database
      await db.collection("users").insertOne(newUser);

      // Return success response
      return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
