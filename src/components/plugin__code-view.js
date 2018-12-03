import debug from 'debug';
import { ElementPlugin } from './plugin';
const log = debug('kss/code-view');
import "./plugin__code-view.scss";

export class kssCodeView extends ElementPlugin {

  static get DEFAULTS() {

    // Set the configuration values on object creation.
    // - idPrefix: The string that uniquely prefixes the ID of all elements that
    //   can receive the fullscreen focus.
    // - bodyClass: The class that is set on the body element when the fullscreen
    //   mode is toggled on.
    // - elementClass: the class that is set on the element that is receiving the
    //   fullscreen focus.
    return {
      selector: '[data-kss-code-view]',
      target: '',
      buttonClass: 'kss-markup--active',
      class: 'kss-component--markup-visible',
      selected: null
    };
  }

  // Initialize the page to see if the fullscreen mode should be immediately
  // turned on.
  init() {
    log('init', this.options);
    this.reference = this.options.reference;
    this.target = kssCodeView.$(this.options.target);

    // Check the location hash to see if it matches the idPrefix.
    if (this.reference == this.options.selected) {
      this.toggle();
    }

    // Initialize all fullscreen toggle buttons.
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      this.toggle();
      return false;
    });

  }

  // Activation function that takes the ID of the element that will receive
  // fullscreen focus.
  toggle() {
    log('toggle');
    this.target.classList.toggle(this.options.class);
    this.element.classList.toggle(this.options.buttonClass);

    // When enabling the focus mode, change the location hash.
    if (this.target.classList.contains(this.options.class)) {
      this.constructor.setQueryString({
        [`${this.name}-selected`]: this.selector
      });
      // Don't follow the link location.
      return false;
    } else {
      this.constructor.setQueryString({
        [`${this.name}-selected`]: this.selector
      });
    }
  }

};



window.addEventListener('load', () => {
  log('ready');
  kssCodeView.$$(kssCodeView.DEFAULTS.selector)
    .forEach((element) => new kssCodeView(element));
});
