const domRef = {
  inputMain: document.getElementById('input-main'),
  inputSecond: document.getElementById('input-secondary'),
  calculate: document.getElementById('equal'),
  xprButtons: document.getElementById('calculator-basic').querySelectorAll('button.expressions'),
  specialButtons: document.getElementById('calculator-basic').querySelectorAll('button[data-func-access]')
}

const ops = { // 'operations'
  dotAllowed: true,
  parenLeft: 0,
  parenRight: 0,
  parenRightAllowed: false,
  inputUpdateAllowed: false,
  evaluatedValue: false
}

// Make sure to clear input fields on page load
window.onload = function() {
  let inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  }
}

// Create handlers ******
function handleClick(event) {
  let input = event.target.textContent;

  // 'input' here gets passed as argument to checkRules' 'input' parameter
  if (checkRules(input)) {
    updateInputMain(input);
    ops.evaluatedValue = false;
  }
  if (ops.inputUpdateAllowed) {
    updateInputSecond();
  }

}

// KEYPRESS & KEYDOWN*
function handleKeypress(event) {
  for (let i = 0; i < domRef.xprButtons.length; i++) {
    let buttonText = domRef.xprButtons[i].textContent;

    if (buttonText === event.key || buttonText === event.char) {
      event.preventDefault();
      let target = domRef.xprButtons[i];
      target.click();
    }

  }

  if (event.key === 'Enter') {
    event.preventDefault();
    let button = document.getElementById('equal');
    button.click();
  }
}

function handleOnKeyDown(event) {
  if (event.key === 'Backspace') {
    event.preventDefault();
    let button = document.getElementById('calculator-basic').querySelector('button[data-func-access="Larr"]');
    button.click();
  } else if (event.key === 'Delete') {
    preventDefault();
    let button = document.getElementById('calculator-basic').querySelector('button[data-func-access="C"]');
    button.click();
  }
}




function handleCalculate(event) {
  let strMain = domRef.inputMain.value;
  let strSubstring = ')';
  let strSecond = domRef.inputSecond.value;

  if (ops.parenLeft === ops.parenRight && (strMain.length > 0 || strMain.indexOf(strSubstring) !== -1)) {
    let expression = math.eval(strSecond + strMain);
    domRef.inputMain.value = expression;
    domRef.inputSecond.value = '';
    ops.evaluatedValue = true;
    ops.parenLeft = 0;
    ops.parenRight = 0;
  }
}

function handleLarr(event) {
  let strMain = domRef.inputMain.value;
  let strSecond = domRef.inputSecond.value;
  let strMainSliced = strMain.slice(-1);
  let strSecondSliced = strSecond.slice(-1);
  ops.evaluatedValue = false;

  if (strMain.length > 0) {
    domRef.inputMain.value = strMain.slice(0, -1);
  } else if (strSecond.length > 0) {
    domRef.inputMain.value = strSecond.slice(0, -1);
    domRef.inputSecond.value = '';
  }

  if (strMainSliced === '(' || strSecondSliced === '(') {
    ops.parenLeft--;
  } else if (strMainSliced === ')' || strSecondSliced === ')') {
    ops.parenRight--;
  }
}

function handleCE(event) {
  domRef.inputMain.value = '0';
  ops.parenLeft = 0;
  ops.parenRight = 0;
}

function handleC(event) {
  domRef.inputSecond.value = '';
  domRef.inputMain.value = '0';
  ops.parenLeft = 0;
  ops.parenRight = 0;
}

function handlePlusMn(event) {
  let strMain = domRef.inputMain.value;
  let firstChar = strMain.charAt(0);
  let minus = '-';
  if (firstChar !== minus) {
    domRef.inputMain.value = minus + domRef.inputMain.value;
  } else {
    domRef.inputMain.value = strMain.slice(1);
  }
}

function handlePi(event) {
  domRef.inputMain.value = '3.14159';
}

// Update inputs so user can see what he/she types
function updateInputMain(input) {
  if (!isNaN(input) && (domRef.inputMain.value === '0' || ops.evaluatedValue)) {
    domRef.inputMain.value = input;
    ops.evaluatedValue = false;
  } else if (domRef.inputMain.value !== '0' || (domRef.inputMain.value === '0' && isNaN(input))) {
    domRef.inputMain.value += input;
  }
}

function updateInputSecond() {
  domRef.inputSecond.value += domRef.inputMain.value;
  domRef.inputMain.value = '';
  ops.inputUpdateAllowed = false;
}


// Dynamically attach event listeners
for (let i = 0; i < domRef.xprButtons.length; i++) {
  domRef.xprButtons[i].addEventListener('click', handleClick);
}

for (let i = 0; i < domRef.specialButtons.length; i++) {
  let data = domRef.specialButtons[i].getAttribute('data-func-access');
  domRef.specialButtons[i].addEventListener('click', window['handle' + data]);
}

document.body.addEventListener('keypress', handleKeypress);
document.body.addEventListener('keydown', handleOnKeyDown);
domRef.calculate.addEventListener('click', handleCalculate);
