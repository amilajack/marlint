/* eslint prefer-arrow-callback: 0 */
/* eslint no-var:0 */
'use strict';
var path = require('path');
var eslint = require('eslint');
var globby = require('globby');
var handleOpts = require('./handle-opts');

exports.lintText = function (str, opts) {
  opts = handleOpts(opts);

  var engine = new eslint.CLIEngine(opts._config);
  return engine.executeOnText(str, opts.filename);
};

exports.lintFiles = function (patterns, opts) {
  opts = handleOpts(opts);

  if (patterns.length === 0) {
    patterns = '**/*.{js,jsx}';
  }

  return globby(patterns, { ignore: opts.ignores }).then(function (paths) {
    // when users are silly and don't specify an extension in the glob pattern
    paths = paths.filter(function (x) {
      var ext = path.extname(x);
      return ext === '.js' || ext === '.jsx';
    });

    var engine = new eslint.CLIEngine(opts._config);
    return engine.executeOnFiles(paths);
  });
};

exports.getFormatter = eslint.CLIEngine.getFormatter;
exports.getErrorResults = eslint.CLIEngine.getErrorResults;
exports.outputFixes = eslint.CLIEngine.outputFixes;
