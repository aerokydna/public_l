
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // 테마 적용 및 아이콘 변경 함수
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.textContent = '🌙'; // 다크 모드일 때 달 아이콘
        } else {
            body.classList.remove('dark-mode');
            themeIcon.textContent = '☀️'; // 라이트 모드일 때 해 아이콘
        }
    };

    // 아이콘 클릭 이벤트 리스너
    themeIcon.addEventListener('click', () => {
        // 현재 body에 dark-mode 클래스가 있는지 확인하여 테마 전환
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // 페이지 로드 시 저장된 테마 적용
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
