
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const generateBtn = document.getElementById('generate-btn');
    const numbersDisplay = document.getElementById('numbers-display');
    const speakerIcon = document.getElementById('speak-btn');
    const languageSelector = document.getElementById('language-selector');
    const yearSelector = document.getElementById('year-selector');

    // Global State
    let voices = [];
    let generatedNumbers = [];
    let lottoChart = null;
    let allLottoData = []; // To store all historical data

    // --- Helper Functions ---
    const getNumberColor = (number) => {
        if (number <= 10) return '#fbc400'; // Yellow
        if (number <= 20) return '#69c8f2'; // Blue
        if (number <= 30) return '#ff7272'; // Red
        if (number <= 40) return '#aaa';    // Gray
        return '#b0d840';                   // Green
    };

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
        if (lottoChart && yearSelector) {
            renderLottoChart(yearSelector.value);
        }
    };
    if (themeIcon) {
        themeIcon.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
        applyTheme(localStorage.getItem('theme') || 'light');
    }

    // --- Lotto Number Generator ---
    if (generateBtn && numbersDisplay && speakerIcon) {
        speakerIcon.style.display = 'none';
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
    function renderLottoChart(filterYear = 'all') {
        const ctx = document.getElementById('lotto-chart');
        if (!ctx || !allLottoData.length) return;

        const filteredData = (filterYear === 'all')
            ? allLottoData
            : allLottoData.filter(row => row.date.startsWith(filterYear));

        const numberCounts = new Array(46).fill(0);
        filteredData.forEach(row => {
            row.numbers.forEach(num => {
                if (num > 0 && num <= 45) {
                    numberCounts[num]++;
                }
            });
        });

        const isDarkMode = body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#f0f2f5' : '#333';
        const lang = document.documentElement.lang || 'ko';
        const chartTitle = translations[lang].chart_title || 'Lottery Number Frequency';
        const finalChartTitle = (filterYear === 'all') 
            ? chartTitle 
            : `${chartTitle} (${filterYear})`;

        if (lottoChart) {
            lottoChart.destroy();
        }

        lottoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 45 }, (_, i) => i + 1),
                datasets: [{
                    label: finalChartTitle,
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
                    legend: { display: false },
                    title: {
                        display: true,
                        text: finalChartTitle,
                        color: labelColor,
                        font: { size: 18, weight: 'bold', family: "'Noto Sans KR', sans-serif" }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: labelColor, stepSize: 1 } },
                    x: { grid: { color: gridColor }, ticks: { color: labelColor } }
                }
            }
        });
    }

    async function initializeChart() {
        if (!document.getElementById('lotto-chart')) return;
        
        try {
            const response = await fetch('lotto_history.csv');
            const csvData = await response.text();
            const rows = csvData.trim().split('\n').slice(1);
            const years = new Set();

            allLottoData = rows.map(row => {
                const columns = row.split(',');
                const date = columns[1];
                if (date) {
                    years.add(date.substring(0, 4));
                }
                return {
                    date: date,
                    numbers: columns.slice(2, 8).map(n => parseInt(n, 10))
                };
            });

            if (yearSelector) {
                const sortedYears = Array.from(years).sort((a, b) => b - a);
                sortedYears.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelector.appendChild(option);
                });
            }

            renderLottoChart('all');

        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }

    // --- Event Listeners ---
    if (yearSelector) {
        yearSelector.addEventListener('change', () => {
            renderLottoChart(yearSelector.value);
        });
    }

    if (languageSelector) {
        languageSelector.addEventListener('change', () => {
           if(lottoChart) {
               const lang = languageSelector.value;
               const chartTitle = translations[lang].chart_title || 'Lottery Number Frequency';
               const selectedYear = yearSelector.value;
               const finalChartTitle = (selectedYear === 'all') ? chartTitle : `${chartTitle} (${selectedYear})`;

               lottoChart.options.plugins.title.text = finalChartTitle;
               lottoChart.data.datasets[0].label = finalChartTitle;
               
               const allOption = yearSelector.querySelector('option[value="all"]');
               if (allOption) {
                   allOption.textContent = translations[lang].chart_year_all || 'All';
               }
               
               lottoChart.update();
           }
        });
    }
    
    initializeChart();
});
