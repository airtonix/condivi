import setQueryString from 'set-query-string';
import debug from 'debug';

const log = debug('kss/plugin');


export class Base {

    static setQueryString (data, options = {clear: false}) {
        setQueryString(data, options);
    }

    static queryConfig(namespace, ...keys) {
        const namespacedKeys = keys.map(key => `${namespace.toLowerCase()}-${key.toLowerCase()}`);
        return (window.location.search || '')
            .replace('?', '')
            .split('&')
            .reduce((hash, pair) => {
                const [key, value] = pair.split('=');
                if (namespacedKeys.includes(key.toLowerCase())) {
                    const simpleKey = Base.camelCase(key.toLowerCase().replace(`${namespace.toLowerCase()}-`, ''));
                    hash[simpleKey] = value;
                }
                return hash;
            }, {});
    }

    static attributeOptions(namespace, defaults, dataset) {
        const options = Object.keys(dataset).reduce((result, key) => {
            const name = key.replace(`${namespace}-`, '');
            log('attributeOptions',{namespace, name});
            result[Base.camelCase(name)] = dataset[key];
            return result;
        }, {});
        return Object.assign({},
            defaults,
            options);

    }

    static camelCase (str) {
        return str
            .replace(/[\W_]+/g, ' ')
            .replace(/\b[a-z](?=[a-z]{1})/ig, letter => letter.toUpperCase())
            .replace(/\s+/g, '')
            .replace(/^\w/, letter => letter.toLowerCase());
    }

    static $ (selector, scopeEl) {
        if (typeof selector != 'string') {
            return;
        }
        scopeEl = typeof scopeEl == 'undefined' ? document : scopeEl;

        var el = scopeEl.querySelector(selector);

        if (!el) {
            log('ERROR %s not in DOM', selector);
        }

        return el;
    }

    static $$ (selector, scopeEl) {
        if (typeof selector != 'string') {
            return [];
        }
        scopeEl = typeof scopeEl == 'undefined' ? document : scopeEl;

        if (scopeEl && scopeEl.querySelectorAll) {
            scopeEl = scopeEl.querySelectorAll(selector);
        }

        return scopeEl && scopeEl.length ? [].slice.call(scopeEl) : [];
    }

    static createElement (name, props) {
        const element = document.createElement(name);
        Object.keys(props).forEach((key) => {
            element.setAttribute(key, props[key]);
        });
        return element;
    }

    static attr (mixedEl, name, value) {
        var domEl = Base.$(mixedEl);

        if (domEl && domEl.setAttribute) {
            domEl.setAttribute(name, value);
        }
    }

    static css (mixedEl, name, value) {
        var domEl = Base.$(mixedEl);

        if (domEl) {
            domEl.style[name] = value;
        }
    }

    static toggleClass (mixedEl, clsname, toggle) {
        var domEl = Base.$(mixedEl);

        if (!domEl) {
            return;
        }

        if (toggle) {
            domEl.className.indexOf(clsname) < 0 && (domEl.className += ' ' + clsname);
        }
        else {
            domEl.className = domEl.className.replace(new RegExp(' ' + clsname, 'g'), '').replace(new RegExp(clsname, 'g'), '');
        }
    }


}

export class GlobalPlugin extends Base {
    constructor(options = {}) {
        super();
        const { name, DEFAULTS } = this.constructor;

        this.name = name.toLowerCase();
        const querystring = Base.queryConfig(
            name,
            ...(DEFAULTS && Object.keys(DEFAULTS) || []));
        this.options = Object.assign(
            {},
            DEFAULTS || {},
            options,
            querystring
        );
        this.init();
    }
}

export class ElementPlugin extends Base {
    constructor (element, options) {
        super();
        const { name, DEFAULTS} = this.constructor;
        this.element = element;
        this.name = name;
        this.options = Object.assign(
            {},
            options,
            Base.attributeOptions(
                this.name,
                DEFAULTS && DEFAULTS || {},
                this.element.dataset),
            DEFAULTS && Base.queryConfig(this.name, ...Object.keys(DEFAULTS)) || {}
        );
        this.element.dataset[this.name] = this;
        this.init();
    }
}
