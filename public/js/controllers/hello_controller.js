/*
 * A simple Stimulus controller to demonstrate
 * that client-side JS is wired up.
 *
 * It connects to any element with `data-controller="hello"`
 */
import { Controller } from "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.2/dist/stimulus.js";

export default class extends Controller {
  connect() {
    // `this.element` refers to the DOM element the controller is attached to
    this.element.innerHTML = `
      <strong>Hello from Stimulus!</strong>
      <p>This content was rendered by <code>hello_controller.js</code>.</p>
    `;
    this.element.style.color = "var(--color-brand-primary)";
  }
}
