const log = require('debug')('styleguide/handlebars/helpers/regex');
const micromatch = require('micromatch');
const MATCH_OPTIONS = {
};

function keys (object) {
    return Object.keys(object);
}

function SectionReferences (sections) {
    return sections && sections.map(section => section.reference);
}

function SectionAssets (assets, sections) {
    let found = false;
    let searchIn = sections.slice();
    while (!found && searchIn.length) {
        const inspect = searchIn.pop();
        log('SectionAssets.searchIn', inspect);
        found = assets.find(asset => {
            const result = micromatch.isMatch(inspect, asset.test, MATCH_OPTIONS);
            log('SectionAssets.test', asset.test, inspect, result);
            return result;
        });
        log('SectionAssets.searchIn.found', found);
    }
    return found;
}

module.exports = { register: function (Handlebars) {
    Handlebars.registerHelper({
        SectionAssets: SectionAssets,
        SectionReferences: SectionReferences,
        keys: keys,
    })
}};
