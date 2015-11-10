/* eslint prefer-arrow-callback: 0 */
/* eslint no-var:0 */
'use strict';
var path = require('path');
var eslint = require('eslint');
var globby = require('globby');
var objectAssign = require('object-assign');
var arrify = require('arrify');
var pkgConf = require('pkg-conf');
var deepAssign = require('deep-assign');

var DEFAULT_IGNORE = [
  'node_modules/**',
  'bower_components/**',
  'coverage/**',
  '{tmp,temp}/**',
  '**/*.min.js',
  '**/bundle.js',
  'fixture.js',
  '{test/,}fixture{s,}/**'
];

var DEFAULT_CONFIG = {
  useEslintrc: false,
  baseConfig: {
    extends: 'marlint'
  }
};

function handleOpts(opts) {
  opts = objectAssign({
    cwd: process.cwd()
  }, opts);

  opts = objectAssign({}, pkgConf.sync('marlint', opts.cwd), opts);

  // alias to help humans
  opts.envs = opts.envs || opts.env;
  opts.globals = opts.globals || opts.global;
  opts.ignores = opts.ignores || opts.ignore;
  opts.rules = opts.rules || opts.rule;

  opts.ignores = DEFAULT_IGNORE.concat(opts.ignores || []);

  opts._config = deepAssign({}, DEFAULT_CONFIG, {
    envs: arrify(opts.envs),
    globals: arrify(opts.globals),
    rules: opts.rules
  });

  if (!opts._config.rules) {
    opts._config.rules = {};
  }

  if (opts.es5) {
    opts._config.baseConfig = 'marlint/es5';
  }

  return opts;
}

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
