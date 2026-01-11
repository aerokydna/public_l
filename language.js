document.addEventListener('DOMContentLoaded', () => {

    const languageSelector = document.getElementById('language-selector');

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            
            if (element.tagName === 'TITLE') {
                element.textContent = translations[lang][key];
            } else if (element.placeholder) {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'META' && element.name === 'description') {
                element.content = translations[lang][key];
            } else if (element.getAttribute('role') === 'button' && key === 'aria_read_aloud') {
                element.setAttribute('aria-label', translations[lang][key]);
            } else {
                element.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('language', lang);
    };

    const initializeLanguage = () => {
        let currentLang = localStorage.getItem('language');

        if (!currentLang) {
            const browserLang = navigator.language.split('-')[0];
            if (translations[browserLang]) {
                currentLang = browserLang;
            } else {
                currentLang = 'en';
            }
        }

        if (languageSelector) {
            languageSelector.value = currentLang;
        }
        setLanguage(currentLang);
    };

    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    initializeLanguage();
});
