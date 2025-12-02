import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import chatRoutes from "./src/routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// routes
app.use("/api", chatRoutes);

// health
app.get("/", (req, res) => res.send("ShadowGPT-lite running."));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
