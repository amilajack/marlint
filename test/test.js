'use strict';
var fs = require('fs');
var path = require('path');
var test = require('ava');
var marlint = require('../');

test('.lintText()', t => {
  var fixture = path.join(__dirname, 'fixtures/default.js');
  var file = fs.readFileSync(fixture, { encoding: 'utf-8' });
  var errors = marlint.lintText(file).results;
  t.is(errors[0].messages[0].ruleId, 'no-unused-vars');

  t.end();
});

test('.lintText() - es5', t => {
  var fixture = path.join(__dirname, 'fixtures/es5.js');
  var file = fs.readFileSync(fixture, { encoding: 'utf-8' });
  var errors = marlint.lintText(file, { es5: true }).results;
  t.is(errors[0].messages[0].ruleId, 'no-undef');

  t.end();
});
