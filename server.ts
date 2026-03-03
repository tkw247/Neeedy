import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

// Initial Data Structure
const initialData = {
  products: [],
  orders: [],
  sliders: [
    {
      id: 'default-slider',
      slides: [
        {
          id: 'slide-1',
          image: 'https://picsum.photos/seed/tech1/1920/1080',
          title: 'Future of Tech',
          subtitle: 'Experience the next generation of smart gadgets.',
          buttonText: 'Shop Now',
          link: '#/shop'
        }
      ],
      settings: {
        transitionType: 'fade',
        speed: 5000
      },
      status: 'active'
    }
  ],
  categories: [
    { id: 'cat-1', name: 'Gadget', status: 'active' },
    { id: 'cat-2', name: 'Fashion', status: 'active' },
    { id: 'cat-3', name: 'Smart Home', status: 'active' },
    { id: 'cat-4', name: 'Audio', status: 'active' },
    { id: 'cat-5', name: 'Gaming', status: 'active' }
  ],
  abandonedCarts: [],
  landingPages: [],
  campaigns: [],
  reviews: [],
  users: [
    { id: 'admin-1', name: 'Admin', email: 'admin@purehub.com', role: 'admin' }
  ]
};

// Load or Initialize Data
let db = initialData;
if (fs.existsSync(DATA_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (e) {
    console.error("Error loading database, using initial data");
  }
}

const saveDb = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json({ limit: '50mb' }));

  // --- API ROUTES ---

  // Stats
  app.get("/api/admin/stats", (req, res) => {
    const totalSales = db.orders.reduce((acc: number, o: any) => acc + o.total, 0);
    const totalOrders = db.orders.length;
    const totalCustomers = new Set(db.orders.map((o: any) => o.customerDetails.email)).size;
    const totalProducts = db.products.length;

    res.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders: db.orders.slice(-5).reverse(),
      topProducts: db.products.sort((a: any, b: any) => b.salesCount - a.salesCount).slice(0, 5)
    });
  });

  // Products
  app.get("/api/products", (req, res) => res.json(db.products));
  app.post("/api/admin/products", (req, res) => {
    const product = { ...req.body, id: Math.random().toString(36).substr(2, 9), salesCount: 0, reviewsCount: 0, rating: 5 };
    db.products.push(product);
    saveDb();
    res.json(product);
  });
  app.put("/api/admin/products/:id", (req, res) => {
    const index = db.products.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body };
      saveDb();
      res.json(db.products[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/products/:id", (req, res) => {
    db.products = db.products.filter((p: any) => p.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Orders
  app.get("/api/admin/orders", (req, res) => res.json(db.orders));
  app.post("/api/admin/orders", (req, res) => {
    const order = { ...req.body, id: `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}` };
    db.orders.push(order);
    saveDb();
    res.json(order);
  });
  app.put("/api/admin/orders/:id/status", (req, res) => {
    const index = db.orders.findIndex((o: any) => o.id === req.params.id);
    if (index !== -1) {
      db.orders[index].status = req.body.status;
      saveDb();
      res.json(db.orders[index]);
    } else res.status(404).json({ error: "Not found" });
  });

  // Sliders
  app.get("/api/sliders", (req, res) => res.json(db.sliders));
  app.post("/api/admin/sliders", (req, res) => {
    const slider = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.sliders.push(slider);
    saveDb();
    res.json(slider);
  });
  app.put("/api/admin/sliders/:id", (req, res) => {
    const index = db.sliders.findIndex((s: any) => s.id === req.params.id);
    if (index !== -1) {
      db.sliders[index] = { ...db.sliders[index], ...req.body };
      saveDb();
      res.json(db.sliders[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/sliders/:id", (req, res) => {
    db.sliders = db.sliders.filter((s: any) => s.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Categories
  app.get("/api/categories", (req, res) => res.json(db.categories));
  app.post("/api/admin/categories", (req, res) => {
    const category = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.categories.push(category);
    saveDb();
    res.json(category);
  });
  app.put("/api/admin/categories/:id", (req, res) => {
    const index = db.categories.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      db.categories[index] = { ...db.categories[index], ...req.body };
      saveDb();
      res.json(db.categories[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/categories/:id", (req, res) => {
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Campaigns
  app.get("/api/campaigns", (req, res) => res.json(db.campaigns));
  app.post("/api/admin/campaigns", (req, res) => {
    const campaign = { ...req.body, id: Math.random().toString(36).substr(2, 9), performance: { uses: 0, revenue: 0 } };
    db.campaigns.push(campaign);
    saveDb();
    res.json(campaign);
  });
  app.put("/api/admin/campaigns/:id", (req, res) => {
    const index = db.campaigns.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      db.campaigns[index] = { ...db.campaigns[index], ...req.body };
      saveDb();
      res.json(db.campaigns[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/campaigns/:id", (req, res) => {
    db.campaigns = db.campaigns.filter((c: any) => c.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Reviews
  app.get("/api/reviews", (req, res) => res.json(db.reviews));
  app.put("/api/admin/reviews/:id", (req, res) => {
    const index = db.reviews.findIndex((r: any) => r.id === req.params.id);
    if (index !== -1) {
      db.reviews[index] = { ...db.reviews[index], ...req.body };
      saveDb();
      res.json(db.reviews[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/reviews/:id", (req, res) => {
    db.reviews = db.reviews.filter((r: any) => r.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Landing Pages
  app.get("/api/landing-pages", (req, res) => res.json(db.landingPages));
  app.post("/api/admin/landing-pages", (req, res) => {
    const page = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    db.landingPages.push(page);
    saveDb();
    res.json(page);
  });
  app.put("/api/admin/landing-pages/:id", (req, res) => {
    const index = db.landingPages.findIndex((p: any) => p.id === req.params.id);
    if (index !== -1) {
      db.landingPages[index] = { ...db.landingPages[index], ...req.body };
      saveDb();
      res.json(db.landingPages[index]);
    } else res.status(404).json({ error: "Not found" });
  });
  app.delete("/api/admin/landing-pages/:id", (req, res) => {
    db.landingPages = db.landingPages.filter((p: any) => p.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // Abandoned Carts
  app.get("/api/admin/abandoned-carts", (req, res) => res.json(db.abandonedCarts));

  // Auth
  app.post("/api/auth/register", (req, res) => {
    const { email, name, password } = req.body;
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = { id: Math.random().toString(36).substr(2, 9), email, name, password, role: 'customer' };
    db.users.push(user);
    saveDb();
    const { password: _, ...userWithoutPassword } = user as any;
    res.json(userWithoutPassword);
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user as any;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
