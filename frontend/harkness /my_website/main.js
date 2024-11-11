document.addEventListener('DOMContentLoaded', function() {
    const text = "Welcome to Harkness";
    const titleElement = document.querySelector('.harkness-title');
    let index = 0;

    function typeText() {
        if (index < text.length) {
            titleElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100); // Controls typing speed (100ms = 0.1s per character)
        }
    }

    typeText();
}); 