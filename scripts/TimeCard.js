const template = document.createElement("template");
template.innerHTML = `
      <section class="card">
          <section class="card-body">
            <section class="card-body-background-top">
              <section class="time"></section>
            </section>
            <section class="card-body-background-bottom"></section>
            <section class="left-gap">
            </section>
            <section class="right-gap"></section>
          </section>
          <section class="card-footer"></section>
        </section>
        <style>
          section[class="card"] {
            display: grid;
            height: 200px;
            width: 200px;
            background-color: var(--dark-desaturated-blue);
            border-radius: 10px;
          }

          section[class="card-footer"]::after {
            letter-spacing: 5px;
            display: grid;
            color: var(--grayish-blue);
            text-align: center;
            margin-top: 25px;
            font-weight: 700;
          }
         
          :host([time-unit="second"]) {
            --time: 1s;

            section[class="card-footer"]::after {
              content: "SECONDS";
            }
          }

          :host([time-unit="minute"]) {
            --time: 60s;

            section[class="card-footer"]::after {
              content: "MINUTES";
            }
          }

          :host([time-unit="hour"]) {
            --time: 3600s;

            section[class="card-footer"]::after {
              content: "HOURS";
            }
          }

          :host([time-unit="day"]) {
            --time: 86400s;

            section[class="card-footer"]::after {
              content: "DAYS";
            }
          }

          section[class="card-body"] {
            display: grid;
            place-content: center;
            color: var(--soft-red);
            font-size: 5em;
            font-weight: 700;
            position: relative;
            height: 90%;
            width: 100%;
            height: 200px;
            width: 200px;
            container: card-body / size;
            overflow: hidden;
            border-radius: 10px;
            box-shadow: 0px 10px 0px -2px var(--very-dark-mostly-black-blue);
          }

          section[class="card-body-background-top"] {
            display: grid;
            height: 100cqh;
            width: 100cqw;
            top: -50cqh;
            background-color: var(--dark-desaturated-blue);
            position: absolute;
            animation-name: note-flip;
            animation-duration: var(--time);
            animation-iteration-count: infinite;
            border-radius: 10px;
            border-bottom: 2px solid var(--very-dark-blue);
            filter: brightness(0.8);
          }

          section[class="card-body-background-top"] section[class="time"] {
            place-self: center;
            position: absolute;
            top: 77%;
          }

          @keyframes note-flip {
            from {
              transform-style: preserve-3d;
              transform: rotateX(0deg);
              transform-origin: 100% bottom;
              z-index: 2;
            }


            to {
              transform: rotateX(180deg);
              transform-origin: 100% bottom;
              z-index: 0;
              color: transparent;
            }
          }

          section[class="card-body-background-bottom"] {
            position: absolute;
            width: 100%;
          }

          section[class="right-gap"],
          section[class="left-gap"] {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background-color: var(--very-dark-blue);
            position: absolute;
            top: calc(50% - 10px);
            z-index: 3;
          }

          section[class="left-gap"] {
            left: -10px;
          }

          section[class="right-gap"] {
            right: -10px;

          }

          section[class="card-footer"] {
            width: 100%;
          }

          section[class="time"] {
            z-index: 1;
          }
        </style>

`;
export default class TimeCard extends HTMLElement {
    #internals;
    constructor() {
        super();
        this.#internals = this.attachInternals();
    }
    connectedCallback(
    ) {
        const shadowRoot = this.attachShadow({ mode: "open" })
        shadowRoot.appendChild(template.content.cloneNode(true));
        if (this.hasAttribute('time-unit')) {
            const timeUnit = this.getAttribute('time-unit');
            console.log(timeUnit)
            switch (timeUnit) {
                case 'second':
                    setInterval(() => {
                        const second=new Date().getSeconds();
                        this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = second;
                        this.setAttribute('time',second);
                    }, 1000);
                    break;

                case 'minute':
                    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getMinutes();
                    setInterval(() => {
                        this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getMinutes();
                    }, 60000);
                    break;

                case 'hour':
                    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getHours();
                    setInterval(() => {
                        this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getHours();
                    }, 3600000);
                    break;

                case 'day':
                    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getDay();
                    setInterval(() => {
                        this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = new Date().getDay();
                    }, 86400000);
                    break;

                default:
                    break;
            }
        }

    }

    static get observedAttributes() {
        return [
            'time-unit',
            'start-date'
        ];
    }
}

if (!customElements.get("time-card")) {
    customElements.define("time-card", TimeCard);
} 