import express from "express";
import jsonServer from "json-server";
import auth from "json-server-auth";
import cors from "cors"; // Use cors package for handling CORS

const server = express();

// Apply CORS before any other middleware
server.use(
  cors({
    origin: "*", // Allow all origins (you can restrict this for production)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow necessary HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Allow necessary headers
    credentials: true,
  })
);

// Setup json-server router
const router = jsonServer.router("./data/db.json");
server.use("/api", router);
server.db = router.db;

// Setup authentication rules
const rules = auth.rewriter({
  products: 444, // No access or read-only permissions for 'products'
  featured_products: 444, // No access or read-only permissions for 'featured_products'
  orders: 660, // Permissions for 'orders' (specific permissions)
  users: 600, // Permissions for 'users' (specific permissions)
});

// Apply authentication rules before other middlewares
server.use(rules);

// Apply the json-server authentication middleware
server.use(auth);

// Apply json-server defaults for logging and other middleware
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Finally, use the router after all the middleware
server.use(router);

// Start the server on port 8000
server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
