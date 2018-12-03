import $script from "$script";
import debug from 'debug';
import { GlobalPlugin } from './plugin';
const log = debug('kss/syntax-highlighting');

export class KssSyntaxHighlighting extends GlobalPlugin {

  static get DEFAULTS() {
    return {
      theme: 'tomorrow',
    };
  }

  init() {
    $script([
        '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.7.5/beautify.min.js',
        '//cdnjs.cloudflare.com/ajax/libs/js-beautify/1.7.5/beautify-html.min.js'
    ], 'sanitise');

    $script.ready(['sanitise'], () => {
        KssSyntaxHighlighting.$$('code.language-markup').forEach((code) => {
            code.textContent = html_beautify(code.innerText);
            console.log(code.innerText);
        });
        $script(['//cdn.jsdelivr.net/npm/prismjs@1.11.0/prism.min.js'], 'prism');
    });

    $script.ready(['prism'], () => {
        this.change();
    });
  }

  change() {
    const url = `//cdn.jsdelivr.net/npm/prismjs@1.11.0/themes/prism${this.options.prismTheme ? '-' + this.options.prismTheme : ''}.css`;
    const sheet = document.querySelector(`link[data-prism-style]`);
    if (!sheet) {
        document
            .querySelector('head')
            .appendChild(this.constructor.createElement('link', {
                'data-prism-style': '',
                'rel': "stylesheet",
                'href': url
            }));
    } else {
      sheet.attr('href', url);
    }
  }
}
