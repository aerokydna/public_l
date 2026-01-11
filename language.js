document.addEventListener('DOMContentLoaded', () => {

    const languageSelector = document.getElementById('language-selector');

    // Function to update text content based on selected language
    const setLanguage = (lang) => {
        document.documentElement.lang = lang; // Update the <html lang> attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            
            // Handle special cases like title and placeholder
            if (element.tagName === 'TITLE') {
                element.textContent = translations[lang][key];
            } else if (element.placeholder) {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'META' && element.name === 'description') {
                element.content = translations[lang][key];
            } else {
                // Use innerHTML for elements that might contain other HTML tags like &copy;
                element.innerHTML = translations[lang][key];
            }
        });
        localStorage.setItem('language', lang); // Save language preference
    };

    // Function to initialize language
    const initializeLanguage = () => {
        // 1. Get language from localStorage
        let currentLang = localStorage.getItem('language');

        // 2. If not in localStorage, get from browser settings
        if (!currentLang) {
            const browserLang = navigator.language.split('-')[0]; // Get 'en' from 'en-US'
            if (translations[browserLang]) {
                currentLang = browserLang;
            } else {
                // 3. If browser language is not supported, default to English
                currentLang = 'en';
            }
        }

        // Set the language selector's value and apply the language
        if (languageSelector) {
            languageSelector.value = currentLang;
        }
        setLanguage(currentLang);
    };

    // Event listener for the language selector
    if (languageSelector) {
        languageSelector.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    // Initial load
    initializeLanguage();
});
