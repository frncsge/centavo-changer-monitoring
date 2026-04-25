import express from "express";
import transactionsRoutes from "./routes/transactions.route.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api", transactionsRoutes);
app.use("/api/auth", authRoutes);

// default check
app.use("/", (req, res) => {
  res.send("Centavo changer monitoring server is running!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
