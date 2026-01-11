
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const speakerIcon = document.getElementById('speak-btn');
    const languageSelector = document.getElementById('language-selector');

    // Global State
    let voices = [];
    let generatedNumbers = [];
    let lottoChart = null;

    // --- Voice Synthesis ---
    function loadVoices() {
        voices = speechSynthesis.getVoices();
    }
    if ('speechSynthesis' in window) {
        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    // --- Theme Management ---
    const applyTheme = (theme) => {
        body.classList.toggle('dark-mode', theme === 'dark');
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        // Re-render chart with updated theme colors
        if (lottoChart) {
            renderLottoChart();
        }
    };
    if (themeIcon) {
        themeIcon.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
        // Initial theme setup
        applyTheme(localStorage.getItem('theme') || 'light');
    }

    // --- Lotto Number Generator ---
    if (generateBtn && numbersDisplay && speakerIcon) {
        speakerIcon.style.display = 'none';

        const getNumberColor = (number) => {
            if (number <= 10) return '#fbc400'; // Yellow
            if (number <= 20) return '#69c8f2'; // Blue
            if (number <= 30) return '#ff7272'; // Red
            if (number <= 40) return '#aaa';    // Gray
            return '#b0d840';                   // Green
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
            generatedNumbers = numbers;
            const placeholder = numbersDisplay.querySelector('p');
            if (placeholder) placeholder.remove();

            // Clear previous numbers
            const numberBalls = numbersDisplay.querySelectorAll('.number-ball');
            numberBalls.forEach(ball => ball.remove());

            // Create and animate new number balls
            numbers.forEach((number, index) => {
                const ball = document.createElement('div');
                ball.className = 'number-ball';
                ball.textContent = number;
                ball.style.backgroundColor = getNumberColor(number);
                ball.style.animationDelay = `${index * 0.1}s`;
                numbersDisplay.insertBefore(ball, speakerIcon);
            });

            speakerIcon.style.display = 'inline-block';
            speakerIcon.classList.add('visible');
        };

        generateBtn.addEventListener('click', () => {
            const numbers = new Set();
            while(numbers.size < 6) {
                numbers.add(Math.floor(Math.random() * 45) + 1);
            }
            const sortedNumbers = Array.from(numbers).sort((a,b) => a - b);
            displayNumbers(sortedNumbers);
        });

        speakerIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (generatedNumbers.length > 0) {
                speakNumbers(generatedNumbers);
            }
        });
    }

    // --- Lotto Statistics Chart ---
    async function renderLottoChart() {
        const ctx = document.getElementById('lotto-chart');
        if (!ctx) return;

        try {
            const response = await fetch('lotto_history.csv');
            const data = await response.text();
            const rows = data.trim().split('\n').slice(1);
            const numberCounts = new Array(46).fill(0);

            rows.forEach(row => {
                const columns = row.split(',');
                for (let i = 1; i <= 6; i++) {
                    const num = parseInt(columns[i], 10);
                    if (!isNaN(num)) {
                        numberCounts[num]++;
                    }
                }
            });

            const isDarkMode = body.classList.contains('dark-mode');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const labelColor = isDarkMode ? '#f0f2f5' : '#333';
            const lang = document.documentElement.lang || 'ko';
            const chartTitle = translations[lang].chart_title || 'Lottery Number Frequency';


            if (lottoChart) {
                lottoChart.destroy();
            }

            lottoChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 45 }, (_, i) => i + 1),
                    datasets: [{
                        label: chartTitle,
                        data: numberCounts.slice(1),
                        backgroundColor: Array.from({ length: 45 }, (_, i) => getNumberColor(i + 1)),
                        borderColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: chartTitle,
                            color: labelColor,
                            font: {
                                size: 18,
                                weight: 'bold',
                                family: "'Noto Sans KR', sans-serif"
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: labelColor
                            }
                        },
                        x: {
                            grid: {
                                color: gridColor
                            },
                            ticks: {
                                color: labelColor
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching or parsing lottery data:', error);
        }
    }

    // Update chart title on language change
    if (languageSelector) {
        languageSelector.addEventListener('change', () => {
           if(lottoChart) {
               const lang = languageSelector.value;
               const chartTitle = translations[lang].chart_title || 'Lottery Number Frequency';
               lottoChart.options.plugins.title.text = chartTitle;
               lottoChart.update();
           }
        });
    }

    // Initial chart render
    renderLottoChart();
});
