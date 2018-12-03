import debug from 'debug';
import { ElementPlugin } from './plugin';
const log = debug('kss/test-runner');
import tape from 'tape';
import mustache from 'mustache';
import "./plugin__test-runner.scss";

const templates = {
    test: `<div class="kss-test kss-test--{{id}}">
    <div class="kss-test__container">
        <div class="kss-test__name">{{name}}</div>
        <div class="kss-test__assertions"></div>
    </div>
</div>`,
    assert: `<div class="kss-test-assertion kss-test-assertion--{{#ok}}pass{{/ok}}{{#notOk}}fail{{/notOk}}">
    <div class="kss-test-assertion__name">{{name}}</div>
    <div class="kss-test-assertion__results">
      <div class="kss-test-assertion__result kss-test-assertion__result--operator">{{operator}}</div>
      <div class="kss-test-assertion__result kss-test-assertion__result--actual">{{actual}}</div>
      <div class="kss-test-assertion__result kss-test-assertion__result--expected">{{expected}}</div>
      <pre class="kss-test-assertion__result kss-test-assertion__result--code">{{error}}</pre>
    </div>
</div>
</div>`
};
mustache.parse(templates.test);
mustache.parse(templates.assert);

export class kssTestRunner extends ElementPlugin {

  static get DEFAULTS() {

    return {
      selector: '[data-kss-test-runner]',
      reportTo: '.kss-component__tap-report'
    };
  }

  // Initialize the page to see if the fullscreen mode should be immediately
  // turned on.
  init () {
    log('init', this.options);
    this.reportElement = document.querySelector(this.options.reportTo);
    this.element.addEventListener('click', this.run.bind(this));
  }

  // Activation function that takes the ID of the element that will receive
  // fullscreen focus.
  run () {
    const {namespace} = this.options;
    if (!kssTestRunner.Tests[namespace]) { return; }
    this.reportElement.innerHTML = '';

    tape.createStream({objectMode:true})
        .on('data', (row) => {
            row.notOk = !row.ok;
            if (row.type == 'test') {
                this.reportElement.innerHTML += mustache.render(templates.test, row);
            } else if (row.type == 'assert') {
                kssTestRunner.$(`.kss-test--${row.test}`, this.reportElement).innerHTML += mustache.render(templates.assert, row);
            }
        });

    kssTestRunner.Tests[namespace](tape);
  }

  static on (namespace, fn) {
    kssTestRunner.Tests[namespace] = fn;
  }

};

kssTestRunner.Tests = {};

window.addEventListener('load', () => {
    log('ready');
    kssTestRunner.$$(kssTestRunner.DEFAULTS.selector)
      .forEach((element) => new kssTestRunner(element));

  });


window.kssTestRunner = kssTestRunner;
