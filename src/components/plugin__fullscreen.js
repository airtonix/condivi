import debug from 'debug';
import { ElementPlugin } from './plugin';
const log = debug('kss/fullscreen');
import "./plugin__fullscreen.scss";

export class kssFullscreen extends ElementPlugin {

  static get DEFAULTS() {

    // Set the configuration values on object creation.
    // - idPrefix: The string that uniquely prefixes the ID of all elements that
    //   can receive the fullscreen focus.
    // - bodyClass: The class that is set on the body element when the fullscreen
    //   mode is toggled on.
    // - elementClass: the class that is set on the element that is receiving the
    //   fullscreen focus.
    return {
      bodyClass: 'kss--is-fullscreen',
      elementClass: 'kss-component--is-fullscreen',
      target: null, // provide this in the html as an id selector.
      selector: '[data-kss-fullscreen]',
      selected: null
    };
  }

  // Initialize the page to see if the fullscreen mode should be immediately
  // turned on.
  init() {
    log('init', this.options);
    this.componentElement = kssFullscreen.$(this.options.target);
    this.element.addEventListener('click', this.setFocus.bind(this));

    // Check the location hash to see if it matches the idPrefix.
    if (this.options.selected) {
      this.setFocus();
    }
    // Initialize all fullscreen toggle buttons.
  }

  // Activation function that takes the ID of the element that will receive
  // fullscreen focus.
  setFocus(event) {
    event && event.preventDefault();

    this.element.classList.toggle(this.options.buttonClass);
    this.componentElement.classList.toggle(this.options.elementClass);
    document.body.classList.toggle(this.options.bodyClass);

    // When enabling the focus mode, change the location hash.
    if (this.element.classList.contains(this.options.elementClass)) {
        kssFullscreen.setQueryString({
            [`${this.name}-selected`]: this.options.reference
        });
        // Don't follow the link location.
    } else {
        kssFullscreen.setQueryString({
            [`${this.name}-selected`]: null
        });
    }

    return false;
  }

};

window.addEventListener('load', () => {
    log('ready');
    kssFullscreen.$$(kssFullscreen.DEFAULTS.selector)
      .forEach((element) => new kssFullscreen(element));
  });
