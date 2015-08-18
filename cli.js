#!/usr/bin/env node
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
		'  --init     Add XO to your project',
		'  --compact  Compact output',
		'  --stdin    Validate code from stdin',
		'  --env      Environment preset  [Can be set multiple times]',
		'  --global   Global variable  [Can be set multiple times]',
		'  --ignore   Additional paths to ignore  [Can be set multiple times]',
		'',
		'Examples',
		'  $ marlint',
		'  $ marlint index.js',
		'  $ marlint *.js !foo.js',
		'  $ marlint --esnext --env=node --env=mocha',
		'',
		'Tips',
		'  Put options in package.json instead of using flags so other tools can read it.'
	]
}, {
	string: [
		'_'
	],
	boolean: [
		'init',
		'compact',
		'stdin'
	]
});

updateNotifier({pkg: cli.pkg}).notify();

var input = cli.input;
var opts = cli.flags;

function log(report) {
	console.log(marlint.getFormatter(opts.compact && 'compact')(report.results));
	process.exit(report.errorCount === 0 ? 0 : 1);
}

if (opts.init) {
	require('./init')();
	return;
}

// `marlint -` => `marlint --stdin`
if (input[0] === '-') {
	opts.stdin = true;
	input.shift();
}

if (opts.stdin) {
	getStdin(function (str) {
		log(marlint.lintText(str));
	});

	return;
}

marlint.lintFiles(input, opts, function (err, report) {
	if (err) {
		throw err;
	}

	log(report);
});
