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
                expression = value + '(' + previousInput || currentInput + ')';
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
