import TimeCard from "./TimeCard.js";
export default class CountdownComponent extends HTMLElement {
  #internals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
  }
  connectedCallback(
  ) {
    if (this.hasAttribute('launch-date')) {
       
    }
  }

  disconnectedCallback() {
  }

  static get observedAttributes() {
    return [
        'launch-date'
    ];
  }
}
if (!customElements.get("countdown-component")) {
  customElements.define("countdown-component", CountdownComponent);
}