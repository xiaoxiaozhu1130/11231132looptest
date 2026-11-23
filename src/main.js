import {createInitialState, transition} from './calculator.js';
let state = createInitialState();
const symbols = {'+': '+', '-': '−', '*': '×', '/': '÷'};
const result = document.querySelector('#result');
function dispatch(action) {
  state = transition(state, action);
  result.textContent = state.error || state.entry;
  document.querySelector('#context').textContent = state.operator ? `${state.accumulator} ${symbols[state.operator]}` : '\u00a0';
  document.querySelector('#notice').textContent = state.notice;
  result.classList.toggle('error', state.phase === 'error');
  for (const button of document.querySelectorAll('[data-type="operator"]')) {
    button.setAttribute('aria-pressed', String(button.dataset.value === state.operator));
  }
}
document.querySelector('.keys').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button) dispatch({type: button.dataset.type, value: button.dataset.value});
});
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
  if (event.key === 'Enter' && event.target.closest?.('button')) return;
  let action;
  if (/^[0-9]$/.test(event.key)) action = {type: 'digit', value: event.key};
  else if (['+', '-', '*', '/'].includes(event.key)) action = {type: 'operator', value: event.key};
  else {
    const type = {'.': 'decimal', '=': 'equals', Enter: 'equals', Backspace: 'backspace', Escape: 'clear'}[event.key];
    if (type) action = {type};
  }
  if (action) { event.preventDefault(); dispatch(action); }
});
dispatch({type: 'clear'});
