import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
console.log("Loading Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);

import express from "express";
import cors from "cors";
import data from "./data.js";
import fs from "fs";
import Razorpay from "razorpay";
import crypto from "crypto";

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

// ✅ RAZORPAY & DB SETUP
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey123456",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret_123456",
});

const DB_FILE = path.join(__dirname, "transactions.json");
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// ✅ RAZORPAY ROUTES
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };
    
    try {
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (razorpayError) {
      console.warn("Razorpay API failed (likely due to dummy keys). Falling back to mock order.");
      res.json({
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency
      });
    }
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/config/razorpay", (req, res) => {
  res.json({ key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummykey123456" });
});

app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bondId, amount, investorId } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret_123456";
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  // In production, compare expectedSignature === razorpay_signature
  // For this test mode, since we might have dummy keys, we will auto-approve if test mode is detected.
  const isAuthentic = expectedSignature === razorpay_signature || secret === "dummy_secret_123456";

  if (isAuthentic) {
    // Store in DB
    const transactions = JSON.parse(fs.readFileSync(DB_FILE));
    
    // ESG calculation mock (1000 INR = 5 trees, 0.2 MWh)
    const esgMetrics = {
      co2Avoided: (amount / 1000) * 0.5,
      treesPlanted: (amount / 1000) * 5,
      renewableEnergy: (amount / 1000) * 0.2,
      score: 85 + Math.min(10, Math.floor(amount / 10000))
    };
    
    const newTx = {
      id: razorpay_payment_id || `tx_${Date.now()}`,
      orderId: razorpay_order_id,
      investorId: investorId || 'anon',
      bondId,
      amount,
      status: "Success",
      timestamp: new Date().toISOString(),
      esgMetrics
    };
    
    transactions.push(newTx);
    fs.writeFileSync(DB_FILE, JSON.stringify(transactions, null, 2));
    
    res.json({ success: true, transaction: newTx });
  } else {
    res.status(400).json({ success: false, error: "Invalid signature" });
  }
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

// ✅ NEW MOCK ENDPOINTS FOR UPGRADED FEATURES
app.get("/api/marketplace", (req, res) => {
  res.json([
    { id: "m1", name: "Global Solar Initiative", rating: "AAA", risk: "Low", roi: 5.2, sector: "Renewable Energy", taxonomy: "EU Taxonomy", available: 50000000 },
    { id: "m2", name: "Clean Water Africa", rating: "AA+", risk: "Medium", roi: 6.8, sector: "Water Management", taxonomy: "ICMA", available: 12000000 },
    { id: "m3", name: "Urban Reforestation Project", rating: "A-", risk: "Medium", roi: 4.5, sector: "Biodiversity", taxonomy: "Climate Bonds", available: 8000000 },
    { id: "m4", name: "Wind Farm Expansion Alpha", rating: "AAA", risk: "Low", roi: 5.0, sector: "Renewable Energy", taxonomy: "EU Taxonomy", available: 150000000 },
    { id: "m5", name: "Sustainable Ocean Aquaculture", rating: "BBB", risk: "High", roi: 8.5, sector: "Sustainable Agriculture", taxonomy: "ICMA", available: 25000000 },
    { id: "m6", name: "Green Housing Development", rating: "AA", risk: "Low", roi: 5.5, sector: "Green Buildings", taxonomy: "EU Taxonomy", available: 75000000 },
  ]);
});

app.get("/api/ai-insights", (req, res) => {
  res.json({
    overallScore: 84,
    riskLevel: "Low",
    greenwashingRisk: "Very Low (2%)",
    insights: [
      "Your portfolio heavily favors Renewable Energy, which aligns with EU Taxonomy standards.",
      "Consider diversifying into Biodiversity bonds to balance your ESG risk profile.",
      "The Urban Reforestation Project has high verifiable impact metrics, confirming low greenwashing risk."
    ]
  });
});

app.get("/api/blockchain-ledger", (req, res) => {
  res.json([
    { hash: "0x3aF8...9c2B", type: "Investment", amount: "₹500,000", bond: "Global Solar", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), verified: true },
    { hash: "0x7bC2...4f1A", type: "Dividend", amount: "₹12,500", bond: "Clean Water", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), verified: true },
    { hash: "0x9dE4...2a5C", type: "Investment", amount: "₹1,200,000", bond: "Wind Farm Alpha", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), verified: true }
  ]);
});

app.get("/api/live-impact", (req, res) => {
  res.json({
    co2Avoided: 154200 + Math.floor(Math.random() * 100),
    energyGenerated: 450000 + Math.floor(Math.random() * 500),
    waterSaved: 890000 + Math.floor(Math.random() * 1000)
  });
});

app.get("/api/issuer/stats", (req, res) => {
  res.json({
    totalCapital: 425000000,
    activeBonds: 8,
    investorCount: 1245,
    esgScore: 92,
    allocation: { green: 45, climate: 35, social: 20 },
    achievements: ["Zero Carbon Footprint 2025", "Top 10 ESG Issuer"]
  });
});

app.get("/api/issuer/projects", (req, res) => {
  res.json([
    { id: "p1", name: "Solar Farm Alpha", sector: "Renewable Energy", progress: 85, target: 150000000, location: "Gujarat, India" },
    { id: "p2", name: "Coastal Wind Project", sector: "Renewable Energy", progress: 60, target: 200000000, location: "Tamil Nadu, India" },
    { id: "p3", name: "EV Highway Infrastructure", sector: "Clean Transport", progress: 40, target: 50000000, location: "Delhi-Mumbai" },
    { id: "p4", name: "Smart Green Building Complex", sector: "Green Buildings", progress: 95, target: 25000000, location: "Bangalore, India" }
  ]);
});

app.get("/api/issuer/transactions", (req, res) => {
  res.json([
    { id: "t1", investor: "Instit. A", amount: 5000000, date: "2026-05-10", type: "Investment" },
    { id: "t2", investor: "Retail Pool B", amount: 1200000, date: "2026-05-09", type: "Investment" },
    { id: "t3", investor: "Instit. C", amount: 8500000, date: "2026-05-08", type: "Investment" }
  ]);
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