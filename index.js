'use strict';

/**
 * This module is used to load the base KSS builder class needed by this builder
 * and to define any custom CLI options or extend any base class methods.
 *
 * Note: since this builder wants to extend the KssBuilderBase class, it
 * must export a KssBuilderBase sub-class as a module. Otherwise, kss-node
 * will assume the builder wants to use the KssBuilderBaseHandlebars class.
 *
 * This file's name should follow standard node.js require() conventions. It
 * should either be named index.js or have its name set in the "main" property
 * of the builder's package.json. See
 * http://nodejs.org/api/modules.html#modules_folders_as_modules
 *
 * @module kss/builder/twig
 */

const KssBuilderBase = require('kss/builder/base/handlebars');
const nconf = require('nconf');
var glob = require('glob');
var readFileSync = require('fs').readFileSync;
var hash = require('hasha');
var vfs = require('vinyl-fs');
var map = require('map-stream');
var {join, parse, basename} = require('path');
var chalk = require('chalk');
var minimatch = require("minimatch")
var mustache = require('mustache');
var filesize = require('filesize');

var log = console.log;


/**
 * A kss-node builder that takes input files and builds a style guide using Twig
 * templates.
 */
class KssBuilder extends KssBuilderBase {
  /**
   * Create a builder object.
   */
  constructor() {
    // First call the constructor of KssBuilderBase.
    super();

    // Then tell kss which Yargs-like options this builder adds.
    this.addOptionDefinitions({
        title: {
            group: 'Style guide:',
            string: true,
            multiple: false,
            describe: 'Title of the style guide',
            default: 'KSS Style Guide'
        },
        assets: {
            group: 'Styleguide:',
            string: false,
            describe: 'per section assets'
        }
    });
  }

  /**
   * Allow the builder to preform pre-build tasks or modify the KssStyleGuide
   * object.
   *
   * The method can be set by any KssBuilderBase sub-class to do any custom tasks
   * after the KssStyleGuide object is created and before the HTML style guide
   * is built.
   *
   * @param {KssStyleGuide} styleGuide The KSS style guide in object format.
   * @returns {Promise.<KssStyleGuide>} A `Promise` object resolving to
   *   `styleGuide`.
   */
  loadHelper (file, done) {
    try {
        file.helper = require(file.path)
        done(null, file);
    } catch (err) {
        throw new Error(err);
        done(err);
    }
  }

  registerHelper (file, done) {
    if (file.helper) {
        file.helper
        && file.helper.register
        && file.helper.register(this.Handlebars);

        KssBuilder.Registered.helpers.push(parse(file.path).name);
    }
    done(null, file);
  }

  registerPartial (file, done) {
    if (file.path && file.contents) {
        const {name} = parse(file.path);
        const formattedName = name
            .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function($1) { return $1.toLowerCase(); })
        const notatedName = `partials.${formattedName}`;
        this.Handlebars.registerPartial(notatedName, file.contents.toString());
        KssBuilder.Registered.partials.push(notatedName);
    }
    done(null, file);
  }

  prepare(styleGuide) {

    // First we let KssBuilderBase.prepare() clean-up the style guide object.
    return super.prepare(styleGuide)
        .then(styleGuide => {

            KssBuilder.Registered = { helpers: [], partials: []}

            return Promise.all([

                new Promise((resolve, reject) => {
                    vfs.src(`${__dirname}/helpers/*.js`, {read: false})
                        .pipe(map(this.loadHelper.bind(this)))
                        .pipe(map(this.registerHelper.bind(this)))
                        .on('end', () => {
                            log('kss.helpers.registered', chalk.yellow(KssBuilder.Registered.helpers.join(', ')));
                            resolve();
                        });
                }),

                new Promise((resolve, reject) => {
                    vfs.src(`${__dirname}/partials/*.hbs`)
                        .pipe(map(this.registerPartial.bind(this)))
                        .on('end', () => {
                            log('kss.partials.registered', chalk.yellow(KssBuilder.Registered.partials.join(', ')));
                            resolve();
                        });
                })

            ])
            .then(() => {
                log('kss.builder.prepare.done');
                return styleGuide
            });

        });
  }
}

module.exports = KssBuilder;
