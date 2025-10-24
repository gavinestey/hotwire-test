import express, { Request, Response } from "express";
import path from "path";
import ejsLayouts from "express-ejs-layouts";

// --- App Setup ---
const app = express();
const port = process.env.PORT || 3000;

// --- In-Memory "Database" ---
// We'll just use a simple array to store items for this demo.
interface Item {
  id: number;
  name: string;
}
const items: Item[] = [
  { id: 1, name: "First Item" },
  { id: 2, name: "Second Item" },
];

// --- View Engine Setup ---
app.use(ejsLayouts);
app.set("layout", "partials/layout"); // Sets the default layout file
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// --- Middleware ---
// Serve static files (CSS, client-side JS)
app.use(express.static(path.join(__dirname, "../public")));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (for potential future API use)
app.use(express.json());

// --- Routes ---

/**
 * Main Home Page
 * Renders the list of items and the form to add new ones.
 */
app.get("/", (req: Request, res: Response) => {
  res.render("pages/index", {
    title: "Home",
    items: items, // Pass our "database" items to the view
  });
});

/**
 * About Page
 * A simple static page to demonstrate Turbo Drive navigation.
 */
app.get("/about", (req: Request, res: Response) => {
  res.render("pages/about", {
    title: "About",
  });
});

/**
 * Form Submission Endpoint (Hotwire Turbo Stream)
 * Handles the 'Add Item' form submission.
 */
app.post("/add-item", (req: Request, res: Response) => {
  const { itemName } = req.body;

  if (!itemName) {
    // In a real app, you'd handle validation more gracefully
    return res.status(400).send("Item name is required");
  }

  const newItem: Item = {
    id: items.length + 1,
    name: itemName,
  };
  items.push(newItem);

  // --- Hotwire Magic ---
  // Check if the request was made by Turbo and accepts a Turbo Stream
  const acceptsTurboStream = req
    .get("Accept")
    ?.includes("text/vnd.turbo-stream.html");

  if (acceptsTurboStream) {
    // If it is a Turbo request, send back a Turbo Stream response
    res.setHeader("Content-Type", "text/vnd.turbo-stream.html");
    // Render the EJS template that defines the <turbo-stream> action
    res.render("streams/append-item", { item: newItem, layout: false });
  } else {
    // If it's a regular form submission (e.g., JS disabled), just redirect
    res.redirect("/");
  }
});

/**
 * Component SSR Endpoint (Hotwire Turbo Frame)
 * This route exists just to render a single component fragment.
 * It will be requested by a <turbo-frame> to lazy-load content.
 */
app.get("/load-card-component", (req: Request, res: Response) => {
  res.render("partials/components/card_frame", {
    title: "Dynamically Loaded Card",
    content: "Hi! This content was loaded from the server via a Turbo Frame!",
    layout: false,
  });
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
