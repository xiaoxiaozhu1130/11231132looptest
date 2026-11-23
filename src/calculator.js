export const createInitialState = () => ({entry: '0', accumulator: null, operator: null, phase: 'editing', error: null, notice: ''});
const operators = ['+', '-', '*', '/'];
function calculate(state) {
  const a = state.accumulator, b = Number(state.entry);
  if (state.operator === '/' && b === 0) return {...createInitialState(), phase: 'error', error: '不能除以零'};
  const value = {'+': () => a + b, '-': () => a - b, '*': () => a * b, '/': () => a / b}[state.operator]();
  if (!Number.isFinite(value)) return {...createInitialState(), phase: 'error', error: '结果超出范围'};
  return {...createInitialState(), entry: String(Number(value.toPrecision(12))), phase: 'result'};
}
export function transition(previous, action) {
  let state = {...previous, notice: ''};
  if (action.type === 'clear') return createInitialState();
  if (action.type === 'digit' || action.type === 'decimal') {
    if (action.type === 'digit' && !/^[0-9]$/.test(action.value)) return previous;
    if (state.phase === 'result' || state.phase === 'error') state = createInitialState();
    if (state.phase === 'waiting') state = {...state, entry: '0', phase: 'editing'};
    if (action.type === 'decimal') {
      if (!state.entry.includes('.')) state.entry += '.';
    } else {
      const entry = state.entry === '0' ? action.value : state.entry + action.value;
      if (entry.replace(/\D/g, '').length > 12) state.notice = '最多输入 12 位数字';
      else state.entry = entry;
    }
    return state;
  }
  if (state.phase === 'error') return state;
  if (action.type === 'operator' && operators.includes(action.value)) {
    if (state.phase === 'waiting') return {...state, operator: action.value};
    if (state.operator) state = calculate(state);
    if (state.phase === 'error') return state;
    return {...state, accumulator: Number(state.entry), operator: action.value, phase: 'waiting'};
  }
  if (action.type === 'equals' && state.operator && state.phase === 'editing') return calculate(state);
  if (action.type === 'sign' && ['editing', 'result'].includes(state.phase)) {
    state.entry = Number(state.entry) === 0 ? '0' : state.entry.startsWith('-') ? state.entry.slice(1) : '-' + state.entry;
  }
  if (action.type === 'backspace' && state.phase === 'editing') {
    state.entry = state.entry.slice(0, -1);
    if (!state.entry || state.entry === '-' || Number(state.entry) === 0 && state.entry === '-0') state.entry = '0';
  }
  return state;
}
