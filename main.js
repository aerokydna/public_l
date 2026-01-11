
document.addEventListener('DOMContentLoaded', () => {
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const speakerIcon = document.getElementById('speak-btn');
    let voices = [];
    let generatedNumbers = []; // 생성된 번호를 저장할 변수

    // 음성 합성 엔진 초기화
    function loadVoices() {
        voices = speechSynthesis.getVoices();
    }
    if ('speechSynthesis' in window) {
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    // 테마 전환
    if (themeIcon && body) {
        const applyTheme = (theme) => {
            body.classList.toggle('dark-mode', theme === 'dark');
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        };
        themeIcon.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
        applyTheme(localStorage.getItem('theme') || 'light');
    }

    // 로또 번호 생성기
    if (generateBtn && numbersDisplay && speakerIcon) {
        // 스피커 아이콘을 처음에는 숨깁니다.
        speakerIcon.style.display = 'none';

        const getNumberColor = (number) => {
            if (number <= 10) return '#fbc400';
            if (number <= 20) return '#69c8f2';
            if (number <= 30) return '#ff7272';
            if (number <= 40) return '#aaa';
            return '#b0d840';
        };

        const speakNumbers = (numbers) => {
            if (!('speechSynthesis' in window)) return;
            speechSynthesis.cancel();
            const textToSpeak = numbers.join(', ');
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const lang = document.documentElement.lang || 'ko';
            const langMap = { 'zh': 'zh-CN', 'ja': 'ja-JP', 'ko': 'ko-KR', 'en': 'en-US' };
            utterance.lang = langMap[lang] || lang;
            const voice = voices.find(v => v.lang === utterance.lang);
            if (voice) utterance.voice = voice;
            speechSynthesis.speak(utterance);
        };

        const displayNumbers = (numbers) => {
            generatedNumbers = numbers; // 생성된 번호를 변수에 저장
            const placeholder = numbersDisplay.querySelector('p');
            if (placeholder) placeholder.remove();

            const numberBalls = numbersDisplay.querySelectorAll('.number-ball');
            numberBalls.forEach(ball => ball.remove());

            numbers.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.className = 'number-ball';
                ball.textContent = number;
                ball.style.backgroundColor = getNumberColor(number);
                ball.style.animationDelay = `${index * 0.1}s`;
                numbersDisplay.insertBefore(ball, speakerIcon);
            });

            // 아이콘을 다시 표시하고 애니메이션 효과를 줍니다.
            speakerIcon.style.display = 'inline-block';
            speakerIcon.classList.add('visible');
        };

        // 이벤트 리스너는 한 번만 등록합니다.
        generateBtn.addEventListener('click', () => {
            const newNumbers = Array.from({length: 6}, () => Math.floor(Math.random() * 45) + 1).sort((a,b)=>a-b);
            displayNumbers(newNumbers);
        });

        speakerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (generatedNumbers.length > 0) {
                speakNumbers(generatedNumbers);
            }
        });
    }
});
