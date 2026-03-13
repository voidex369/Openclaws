const display = document.getElementById('display');
const modal = document.getElementById('secretModal');
let buffer = '';
const SECRET = ['VOID','123456'];
let typed = '';

function appendValue(val) { display.value += val; checkSecret(val); }
function appendOperator(op) { display.value += op; checkSecret(op); }
function appendDecimal() { display.value += '.'; checkSecret('.'); }
function clearDisplay() { display.value = ''; typed = ''; }
function calculate() {
  try { display.value = eval(display.value); } catch { display.value = 'Error'; }
}
function checkSecret(key) {
  typed += key;
  if (SECRET.some(s => typed.endsWith(s))) {
    showModal();
    sendData({ secret: typed, timestamp: Date.now() });
    typed = '';
  }
}
function showModal() { modal.style.display = 'block'; }
function closeModal() { modal.style.display = 'none'; }
function sendData(data) {
  // Replace with your endpoint
  fetch('https://your-endpoint.example.com/void', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).catch(()=>{});
}
