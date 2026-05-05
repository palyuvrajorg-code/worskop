import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import data from "./data.js";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "*" // change to your Vercel URL later
}));
app.use(express.json());

// ✅ TEST ROUTE (VERY IMPORTANT)
app.get("/api/status", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ API ROUTES
app.get("/api/impact", (req, res) => {
  const categories = data.categories.map((category) => {
    const items = data.projects.filter(
      (project) => project.category === category.id
    );

    const totalFunding = items.reduce((sum, project) => sum + project.funding, 0);
    const totalImpact = items.reduce((sum, project) => sum + project.impact, 0);

    const efficiency = totalFunding
      ? (totalImpact / totalFunding) * 10000
      : 0;

    return {
      ...category,
      totalFunding,
      totalImpact,
      efficiency: Number(efficiency.toFixed(2)),
      projects: items,
    };
  });

  const ranking = [...categories].sort((a, b) => b.efficiency - a.efficiency);

  res.json({
    categories,
    ranking,
    overview: data.overview,
  });
});

app.get("/api/overview", (req, res) => {
  res.json(data.overview);
});

app.get("/api/bonds", (req, res) => {
  try {
    const bondsPath = path.resolve(__dirname, "../dataset/green_bonds.json");
    const bondsData = fs.readFileSync(bondsPath, "utf-8");
    res.json(JSON.parse(bondsData));
  } catch (error) {
    console.error("Error reading bonds data:", error);
    res.status(500).json({ error: "Failed to load bonds data" });
  }
});

// ✅ Serve frontend (ONLY if dist exists)
const frontendDist = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// ✅ PORT FIX (CRITICAL FOR RAILWAY)
const PORT = process.env.PORT || 4000;

// ✅ BIND TO 0.0.0.0 (VERY IMPORTANT)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});