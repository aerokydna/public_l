
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');

    const getNumberColor = (number) => {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';     // Gray
        return '#b0d840'; // Green
    };

    const generateLottoNumbers = () => {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    };

    const displayNumbers = (numbers) => {
        numbersDisplay.innerHTML = '';
        numbers.forEach((number, index) => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = number;
            ball.style.backgroundColor = getNumberColor(number);
            ball.style.animationDelay = `${index * 0.1}s`;
            numbersDisplay.appendChild(ball);
        });
    };

    generateBtn.addEventListener('click', () => {
        const generatedNumbers = generateLottoNumbers();
        displayNumbers(generatedNumbers);
    });
});
