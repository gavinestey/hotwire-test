/*
 * This is the main entrypoint for our client-side JavaScript.
 * It imports the Stimulus application and registers our controllers.
 */
import { Application } from "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/dist/stimulus.js";

// Import our controllers
import HelloController from "./controllers/hello_controller.js";

// Start the Stimulus application
window.Stimulus = Application.start();

// Register controllers
window.Stimulus.register("hello", HelloController);

console.log("Stimulus application started.");
