"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
// --- App Setup ---
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const items = [
    { id: 1, name: "First Item" },
    { id: 2, name: "Second Item" },
];
// --- View Engine Setup ---
app.use(express_ejs_layouts_1.default);
app.set("layout", "partials/layout"); // Sets the default layout file
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
// --- Middleware ---
// Serve static files (CSS, client-side JS)
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express_1.default.urlencoded({ extended: true }));
// Parse JSON bodies (for potential future API use)
app.use(express_1.default.json());
// --- Routes ---
/**
 * Main Home Page
 * Renders the list of items and the form to add new ones.
 */
app.get("/", (req, res) => {
    res.render("pages/index", {
        title: "Home",
        items: items, // Pass our "database" items to the view
    });
});
/**
 * About Page
 * A simple static page to demonstrate Turbo Drive navigation.
 */
app.get("/about", (req, res) => {
    res.render("pages/about", {
        title: "About",
    });
});
/**
 * Form Submission Endpoint (Hotwire Turbo Stream)
 * Handles the 'Add Item' form submission.
 */
app.post("/add-item", (req, res) => {
    const { itemName } = req.body;
    if (!itemName) {
        // In a real app, you'd handle validation more gracefully
        return res.status(400).send("Item name is required");
    }
    const newItem = {
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
        res.render("streams/append-item", { item: newItem });
    }
    else {
        // If it's a regular form submission (e.g., JS disabled), just redirect
        res.redirect("/");
    }
});
/**
 * Component SSR Endpoint (Hotwire Turbo Frame)
 * This route exists just to render a single component fragment.
 * It will be requested by a <turbo-frame> to lazy-load content.
 */
app.get("/load-card-component", (req, res) => {
    // We don't use the layout file here, we just render the component.
    // EJS's `include` doesn't work with `layout: false` well,
    // so we just render the partial directly.
    res.render("partials/components/card", {
        title: "Dynamically Loaded Card",
        content: "This content was loaded from the server via a Turbo Frame!",
    });
});
// --- Start Server ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
