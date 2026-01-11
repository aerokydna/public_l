
document.addEventListener('DOMContentLoaded', () => {
    // --- 테마 전환 관련 요소 ---
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // --- 로또 번호 생성기 관련 요소 ---
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');

    // 테마 전환 로직 (모든 페이지에서 공통으로 실행)
    if (themeIcon && body) {
        const applyTheme = (theme) => {
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                themeIcon.textContent = '🌙'; // 다크 모드일 때 달 아이콘
            } else {
                body.classList.remove('dark-mode');
                themeIcon.textContent = '☀️'; // 라이트 모드일 때 해 아이콘
            }
        };

        themeIcon.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }

    // 로또 번호 생성기 로직 (번호 생성기 요소가 있는 페이지에서만 실행)
    if (generateBtn && numbersDisplay) {
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
    }
});
