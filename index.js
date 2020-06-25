const CLOCK_BUTTON_ID = 'js-toggle-mode';
const CLOCK_CONTAINER_SELECTOR = '.clock__container';
const CLOCK_ID = 'js-clock';
const CLOCK_IS_ACTIVE_CLASS = 'clock__container--is-active';
const CLOCK_SIZE = 640;
const HOURS_DISPLAY_ID = 'js-hours-digital';
const HOURS_HAND_SHIFT = 30;
const HOURS_PROPERTY_NAME = '--hours';
const MAX_SIZE_OF_CLOCK = 800;
const MINUTES_DISPLAY_ID = 'js-minutes-digital';
const MINUTES_HAND_SHIFT = 6;
const MINUTES_PROPERTY_NAME = '--minutes';
const ONE_SECOND = 1000;
const SCALE_PROPERTY_NAME = '--scale-value';
const SECOND_PROPERTY_NAME = '--seconds';
const SECONDS_DISPLAY_ID = 'js-seconds-digital';

class Clock {
	constructor() {
		this.windowProperty = {
			cursorX: 0,
			cursorY: 0,
			isDraggable: false,
			left: 0,
			top: 0,
			transformOffset: 0,
		};

		this.attachToElements();
		this.handleResizeWindow();
		window.setInterval(() => this.clockTick(), ONE_SECOND);
		this.buttonElement.addEventListener('click', () => this.handleToogleClock());
		window.addEventListener('resize', () => this.handleResizeWindow())
		window.addEventListener('mousedown', event => this.handleMouseDown(event));
		window.addEventListener('mouseup', () => this.windowProperty.isDraggable = false);
		window.addEventListener('mouseout', () => this.windowProperty.isDraggable = false);
		window.addEventListener('mousemove', event => this.dragClockWindow(event));
	}

	handleMouseDown(event) {
		const { top, left, width } = this.clockElement.getBoundingClientRect();

		this.windowProperty = {
			cursorX: event.clientX,
			cursorY: event.clientY,
			isDraggable: true,
			left,
			top,
			transformOffset: width / 2,
		};
	}

	dragClockWindow(event) {
		if (!this.windowProperty.isDraggable) {
			return;
		}

		this.clockElement.style.left = `${event.clientX - this.windowProperty.cursorX + this.windowProperty.left + this.windowProperty.transformOffset}px`;
		this.clockElement.style.top = `${event.clientY - this.windowProperty.cursorY + this.windowProperty.top + this.windowProperty.transformOffset}px`;
	}

	attachToElements() {
		this.hoursDisplayElement = document.getElementById(HOURS_DISPLAY_ID);
		this.minutesDisplayElement = document.getElementById(MINUTES_DISPLAY_ID);
		this.secondsDisplayElement = document.getElementById(SECONDS_DISPLAY_ID);
		this.propertyContainer = document.documentElement.style;
		this.clockElement = document.getElementById(CLOCK_ID);
		this.containersElements = [...document.querySelectorAll(CLOCK_CONTAINER_SELECTOR)];
		this.buttonElement = document.getElementById(CLOCK_BUTTON_ID);
	}

	handleResizeWindow() {
		const maxSize = window.innerWidth > window.innerHeight
			? window.innerHeight
			: window.innerWidth;

		const scale = maxSize > MAX_SIZE_OF_CLOCK ? MAX_SIZE_OF_CLOCK / CLOCK_SIZE : maxSize / CLOCK_SIZE;
		this.propertyContainer.setProperty(SCALE_PROPERTY_NAME, scale);
	}

	clockTick() {
		const timer = new Date();
		const seconds = timer.getSeconds();
		const minutes = timer.getMinutes();
		const hours = timer.getHours();

		this.hoursDisplayElement.textContent = hours <= 9 ? `0${hours}` : hours;
		this.minutesDisplayElement.textContent = minutes <= 9 ? `0${minutes}` : minutes;
		this.secondsDisplayElement.textContent = seconds <= 9 ? `0${seconds}` : seconds;
		this.propertyContainer.setProperty(SECOND_PROPERTY_NAME, seconds);
		this.propertyContainer.setProperty(MINUTES_PROPERTY_NAME, `${minutes * MINUTES_HAND_SHIFT}deg`);
		this.propertyContainer.setProperty(HOURS_PROPERTY_NAME, `${hours % 12 * HOURS_HAND_SHIFT}deg`);
	}

	handleToogleClock() {
		this.containersElements.forEach(clockElement => clockElement.classList.toggle(CLOCK_IS_ACTIVE_CLASS));
	}
}

new Clock();