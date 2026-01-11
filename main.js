
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = document.getElementById('theme-icon'); // 아이콘을 위한 요소 추가
    const body = document.body;

    // Theme switcher logic
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeSwitcher.checked = true;
            themeIcon.textContent = '🌙'; // 다크 모드일 때 달 아이콘
        } else {
            body.classList.remove('dark-mode');
            themeSwitcher.checked = false;
            themeIcon.textContent = '☀️'; // 라이트 모드일 때 해 아이콘
        }
    };

    themeSwitcher.addEventListener('change', () => {
        if (themeSwitcher.checked) {
            localStorage.setItem('theme', 'dark');
            applyTheme('dark');
        } else {
            localStorage.setItem('theme', 'light');
            applyTheme('light');
        }
    });

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


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
