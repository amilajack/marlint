import fs from 'fs';
import path from 'path';
import test from 'ava';
import marlint from '../' ;

test('.lintText()', t => {
  const fixture = path.join(__dirname, 'fixtures/default.js');
  const file = fs.readFileSync(fixture, { encoding: 'utf-8' });
  const errors = marlint.lintText(file).results;
  t.is(errors[0].messages[0].ruleId, 'no-unused-vars');

  t.end();
});

test('.lintText() - es5', t => {
  const fixture = path.join(__dirname, 'fixtures/es5.js');
  const file = fs.readFileSync(fixture, { encoding: 'utf-8' });
  const errors = marlint.lintText(file, { es5: true }).results;
  t.is(errors[0].messages[0].ruleId, 'one-var');

  t.end();
});
