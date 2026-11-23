import test from 'node:test';
import assert from 'node:assert/strict';
import {createInitialState, transition} from '../src/calculator.js';
function run(keys, initial = createInitialState()) {
  return [...keys].reduce((state, key) => transition(state, /\d/.test(key) ? {type: 'digit', value: key} : '+-*/'.includes(key) ? {type: 'operator', value: key} : {type: {'.': 'decimal', '=': 'equals', '~': 'sign', '<': 'backspace', C: 'clear'}[key]}), initial);
}
const cases = [
 ['12+7=', '19'], ['9-14=', '-5'], ['6*8=', '48'], ['9/4=', '2.25'],
 ['2+3*4=', '20'], ['0.1+0.2=', '0.3'], ['1/3=', '0.333333333333'],
 ['.5.2', '0.52'], ['005', '5'], ['5~*2=', '-10'], ['0~', '0'],
 ['8+*2=', '16'], ['8+=2=', '10'], ['2+3==', '5'], ['2+3==*4=', '20'],
 ['2+3=*4=7', '7'], ['123<', '12'], ['123<C', '0'], ['8/0=2+3=', '5'],
 ['8/0=.5', '0.5'], ['1/3=*3=', '0.999999999999'], ['5~<', '0'],
 ['2+~3=', '5'], ['2+<3=', '5'], ['2+3=<', '5'], ['2+3=~', '-5'],
 ['2+3=.', '0.'], ['0.00~', '0'], ['2+3=~*2=', '-10'],
];
for (const [keys, expected] of cases) test(keys, () => assert.equal(run(keys).entry, expected));
test('missing operand and repeated equals preserve pending state', () => {
 const state = run('8+=='); assert.equal(state.phase, 'waiting'); assert.equal(state.accumulator, 8);
});
test('limit and recovery', () => {
 const state = run('1234567890123'); assert.equal(state.entry, '123456789012'); assert.match(state.notice, /12/);
 const corrected = run('<3', state); assert.equal(corrected.entry, '123456789013'); assert.equal(corrected.notice, '');
});
test('division error, ignored actions and reset', () => {
 const state = run('8/0='); assert.equal(state.error, '不能除以零');
 assert.equal(run('+~<=', state).phase, 'error'); assert.deepEqual(run('C', state), createInitialState());
});
test('overflow within 40 multiplications and recovery', () => {
 let state = run('999999999999');
 for (let i = 0; i < 40 && state.phase !== 'error'; i++) state = run('*999999999999=', state);
 assert.equal(state.error, '结果超出范围'); assert.equal(run('2+3=', state).entry, '5');
});
test('scientific notation, rounded carry and negative zero', () => {
 assert.equal(run('999999999999*999999999999=').entry, '9.99999999998e+23');
 assert.equal(run('1~-1~=').entry, '0');
});
test('unknown actions and invalid digits do not corrupt state', () => {
 const state = run('12'); assert.deepEqual(transition(state, {type: 'digit', value: 'x'}), state);
 assert.deepEqual(transition(state, {type: 'operator', value: 'eval'}), state);
});
