const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let operator = '';
let previousInput = '';
let expression = '';

function updateDisplay() {
    expressionEl.textContent = expression || '0';
    resultEl.textContent = currentInput || '0';
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value >= '0' && value <= '9' || value === '.') {
            currentInput += value;
            if (expression === '0' || !expression) expression = currentInput;
            else expression += value;
            updateDisplay();
        } else if (value === 'c') {
            currentInput = '';
            previousInput = '';
            operator = '';
            expression = '';
            updateDisplay();
        } else if (value === '=') {
            if (currentInput && previousInput && operator) {
                const result = calculate(previousInput, currentInput, operator);
                resultEl.textContent = result;
                currentInput = result.toString();
                expression = previousInput + operator + currentInput;
                previousInput = '';
                operator = '';
            }
        } else if (['+', '-', '*', '/', '%'].includes(value)) {
            if (currentInput) {
                if (previousInput && operator) {
                    const tempResult = calculate(previousInput, currentInput, operator);
                    previousInput = tempResult.toString();
                    currentInput = '';
                    expression = previousInput + value;
                } else {
                    previousInput = currentInput;
                    currentInput = '';
                    expression = previousInput + value;
                }
                operator = value;
                updateDisplay();
            }
        } else if (value === '()') {
            if (currentInput.includes('(')) {
                currentInput += ')';
                expression += ')';
            } else {
                currentInput += '(';
                expression += '(';
            }
            updateDisplay();
        } else if (value === 'π') {
            const piStr = Math.PI.toFixed(6);
            currentInput += piStr;
            expression += 'π';
            updateDisplay();
        } else if (value === 'e') {
            const eStr = Math.E.toFixed(6);
            currentInput += eStr;
            expression += 'e';
            updateDisplay();
        } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'x²', '1/x'].includes(value)) {
            if (currentInput) {
                const num = parseFloat(currentInput);
                const result = applyFunction(value, num);
                currentInput = result.toString();
                expression = value + '(' + (previousInput || currentInput) + ')';
                resultEl.textContent = currentInput;
                previousInput = '';
                operator = '';
                updateDisplay();
            }
        }
    });
});

function calculate(a, b, op) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
        case '+':
            return numA + numB;
        case '-':
            return numA - numB;
        case '*':
            return numA * numB;
        case '/':
            return numB !== 0 ? numA / numB : 'Error';
        case '%':
            return numA % numB;
        default:
            return 0;
    }
}

function applyFunction(func, num) {
    switch (func) {
        case 'sin':
            return Math.sin(num * Math.PI / 180).toFixed(6);
        case 'cos':
            return Math.cos(num * Math.PI / 180).toFixed(6);
        case 'tan':
            return Math.tan(num * Math.PI / 180).toFixed(6);
        case 'log':
            return num > 0 ? Math.log10(num).toFixed(6) : 'Error';
        case 'ln':
            return num > 0 ? Math.log(num).toFixed(6) : 'Error';
        case 'sqrt':
            return num >= 0 ? Math.sqrt(num).toFixed(6) : 'Error';
        case 'x²':
            return Math.pow(num, 2).toFixed(6);
        case '1/x':
            return num !== 0 ? (1 / num).toFixed(6) : 'Error';
        default:
            return num;
    }
}

updateDisplay();

// --- Keyboard Support Section ---
window.addEventListener('keydown', (event) => {
    const key = event.key;
    let buttonToClick;

    const allButtons = document.querySelectorAll('.btn');

    // Support for numbers and decimal point
    if ((key >= '0' && key <= '9') || key === '.') {
        buttonToClick = [...allButtons].find(btn => btn.textContent === key);
    }
    // Support for basic operators
    else if (['+', '-', '*', '/'].includes(key)) {
        buttonToClick = [...allButtons].find(btn => btn.textContent === key);
    }
    // Support for Enter and equals (=)
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        // Try to find button with text '='
        buttonToClick = [...allButtons].find(btn => btn.textContent === '=');
        // Or fallback to id 'equals'
        if (!buttonToClick) buttonToClick = document.getElementById('equals');
    }
    // Support for Backspace and Escape as "clear"
    else if (key === 'Backspace' || key === 'Escape') {
        buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'c');
    }
    // Support for parenthesis
    else if (key === '(' || key === ')') {
        buttonToClick = [...allButtons].find(btn => btn.textContent === '()');
    }
    // Support for percentage
    else if (key === '%') {
        buttonToClick = [...allButtons].find(btn => btn.textContent === '%');
    }
    // Support for pi and e
    else if (key.toLowerCase() === 'p') {
        buttonToClick = [...allButtons].find(btn => btn.textContent === 'π');
    } else if (key.toLowerCase() === 'e') {
        buttonToClick = [...allButtons].find(btn => btn.textContent === 'e');
    }
    // Support for scientific functions with first letter (optional)
    else if (key.toLowerCase() === 's') {
        buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'sin');
    } else if (key.toLowerCase() === 'c') {
        // avoid conflict with clear
        // only trigger if Shift is held (Shift+C = Cos)
        if (event.shiftKey)
            buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'cos');
    } else if (key.toLowerCase() === 't') {
        buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'tan');
    } else if (key.toLowerCase() === 'l') {
        if (event.shiftKey)
            buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'ln');
        else
            buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'log');
    } else if (key === 'r') {
        buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'sqrt');
    } else if (key === 'x') {
        if (event.shiftKey)
            buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === 'x²');
        else
            buttonToClick = [...allButtons].find(btn => btn.textContent.toLowerCase() === '1/x');
    }

    if (buttonToClick) {
        buttonToClick.click();
    }
});

