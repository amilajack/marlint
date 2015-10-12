#!/usr/bin/env node
/* eslint prefer-arrow-callback:0 */
'use strict';
var updateNotifier = require('update-notifier');
var getStdin = require('get-stdin');
var meow = require('meow');
var marlint = require('./');

var cli = meow({
  help: [
    'Usage',
    '  $ marlint [<file|glob> ...]',
    '',
    'Options',
    '  --compact       Compact output',
    '  --stdin         Validate code from stdin',
    '  --es5           Disable ES2015+ rules',
    '  --env           Environment preset  [Can be set multiple times]',
    '  --global        Global variable  [Can be set multiple times]',
    '  --ignore        Additional paths to ignore  [Can be set multiple times]',
    '',
    'Examples',
    '  $ marlint',
    '  $ marlint index.js',
    '  $ marlint *.js !foo.js',
    '  $ marlint --es5',
    '  $ marlint --env=node --env=mocha',
    '',
    'Tips',
    '  Put options in package.json instead of using flags so other tools can read it.'
  ]
}, {
  string: [
    '_'
  ],
  boolean: [
    'compact',
    'stdin'
  ]
});

updateNotifier({ pkg: cli.pkg }).notify();

var input = cli.input;
var opts = cli.flags;

function error(err) {
  console.error(err.stack);
  process.exit(1);
}

function log(report) {
  process.stdout.write(marlint.getFormatter(opts.compact && 'compact')(report.results));
  process.exit(report.errorCount === 0 ? 0 : 1);
}

// `marlint -` => `marlint --stdin`
if (input[0] === '-') {
  opts.stdin = true;
  input.shift();
}

if (opts.stdin) {
  getStdin().then(function (str) {
    log(marlint.lintText(str, opts));
  });
} else {
  marlint.lintFiles(input, opts).then(log).catch(error);
}
