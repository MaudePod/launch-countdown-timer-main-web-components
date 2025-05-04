import { DateTime } from './luxon/luxon.min.js';

const template = document.createElement("template");
template.innerHTML = `
 <section class="card">
      <section class="card-body">
        <section class="card-body-background-top"></section>
        <section class="time"></section>
        <section class="card-body-background-bottom"></section>
        <section class="left-gap"></section>
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
        section[class="card-footer"]::after {
          content: "SECONDS";
        }

        section[class="card-body-background-top"] {
          display: grid;
          height: 100cqh;
          width: 100cqw;
          top: -50cqh;
          background-color: var(--dark-desaturated-blue);
          position: absolute;
          animation-name: note-flip;
          animation-duration: 1s;
          animation-iteration-count: infinite;
          border-radius: 10px;
          border-bottom: 2px solid var(--very-dark-blue);
          filter: brightness(0.8);
        }
      }

      :host([flip-page]) {
        section[class="card-body-background-top"] {
          display: grid;
          height: 100cqh;
          width: 100cqw;
          top: -50cqh;
          background-color: var(--dark-desaturated-blue);
          position: absolute;
          animation-name: note-flip;
          animation-duration: 1s;
          animation-iteration-count: 1;
          border-radius: 10px;
          border-bottom: 2px solid var(--very-dark-blue);
          filter: brightness(0.8);
        }
      }

      :host([time-unit="minute"]) {
        section[class="card-footer"]::after {
          content: "MINUTES";
        }
      }

      :host([time-unit="hour"]) {
        section[class="card-footer"]::after {
          content: "HOURS";
        }
      }

      :host([time-unit="day"]) {
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
        border-radius: 10px;
        border-bottom: 2px solid var(--very-dark-blue);
        filter: brightness(0.8);
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

      @container body (inline-size < 1000px) {
        section[class="card"] {
          width: 80px;
          height: 80px;
        }

        section[class="time"] {
          font-size: 0.5em;
        }

        section[class="card-footer"]::after {
          font-size: 0.6em;
        }

        section[class="card-body"] {
          width: 80px;
          height: 80px;
        }

        section[class="right-gap"],
        section[class="left-gap"],
        section[class="right-gap"],
        section[class="right-gap"] {
          height: 15px;
          width: 15px;
        }
      }
    </style>

`;
export default class TimeCard extends HTMLElement {
  #internals;
  #launchDate;
  constructor() {
    super();
    this.#internals = this.attachInternals();
  }
  connectedCallback(
  ) {
    const shadowRoot = this.attachShadow({ mode: "open" })
    shadowRoot.appendChild(template.content.cloneNode(true));
    if (this.hasAttribute('launch-date')) {
      this.#launchDate = DateTime.fromISO(this.getAttribute('launch-date'));
    }
    if (this.hasAttribute('time-unit')) {
      const timeUnit = this.getAttribute('time-unit');
      const startDate = this.#launchDate.diff(DateTime.now(), ["days", "hours", "minutes", 'seconds']).toObject();
      const secondsToStart = Math.floor(startDate.seconds % 60) * 1000;
      switch (timeUnit) {
        case 'second':
          this.countdownSeconds();
          break;

        case 'minute':
          this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = startDate.minutes;
          this.countDownToLaunch(secondsToStart, this.showMinutes, this.countdownMinutes);
          break;

        case 'hour':
          this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = startDate.hours;
          this.countDownToLaunch(secondsToStart, this.showHours, this.countdownHours);
          break;

        case 'day':
          this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = startDate.days;
          this.countDownToLaunch(secondsToStart, this.showDays, this.countdownDays);
          break;

        default:
          break;
      }
    }

  }
  countdownSeconds = () => {
    setInterval(() => {
      this.showSeconds();
    }, 1000);
  }
  getSeconds = () => {
    const timeToLaunch = this.#launchDate.diff(DateTime.now(), ['seconds']).toObject();
    const seconds = Math.floor(timeToLaunch.seconds % 60);
    return seconds;
  }
  showSeconds = () => {
    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = this.getSeconds();
  }
  countDownToLaunch = (secondsToStart, showTimeUnit, countdown) => {
    setTimeout(() => {
      showTimeUnit();
      this.flipPage();
      countdown();
    }, secondsToStart);
  }
  getMinutes = () => {
    const timeToLaunch = this.#launchDate.diff(DateTime.now(), ['minutes']).toObject();
    const minutes = Math.floor(timeToLaunch.minutes % 60);
    return minutes;
  }
  showMinutes = () => {
    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = this.getMinutes();
  }
  countdownMinutes = () => {
    const milisecondsInAMinute = 60000;
    setInterval(() => {
      this.flipPage();
      this.showMinutes();
    }, milisecondsInAMinute);
  }
  getHours = () => {
    const timeToLaunch = this.#launchDate.diff(DateTime.now(), ['hours']).toObject();
    const hours = Math.floor(timeToLaunch.hours % 24);
    return hours;
  }
  showHours = () => {
    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = this.getHours();
  }
  countdownHours = () => {
    const milisecondsInAnHour = 3600000;
    setInterval(() => {
      this.flipPage();
      this.showHours();
    }, milisecondsInAnHour);
  }
  getDays = () => {
    const timeToLaunch = this.#launchDate.diff(DateTime.now(), ['days']).toObject();
    const days = Math.floor(timeToLaunch.days);
    return days;
  }
  showDays = () => {
    this.#internals.shadowRoot.querySelector('section[class="time"]').innerHTML = this.getDays();
  }
  countdownDays = () => {
    const milisecondsInADay = 86400000;
    setInterval(() => {
      this.flipPage();
      this.showDays();
    }, milisecondsInADay);
  }
  flipPage = () => {
    this.setAttribute('flip-page', "");
    setTimeout(() => {
      this.removeAttribute('flip-page');
    }, 1000);
  }
  static get observedAttributes() {
    return [
      'time-unit',
      'launch-date',
      'time'
    ];
  }
}

if (!customElements.get("time-card")) {
  customElements.define("time-card", TimeCard);
} 