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
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const placeholders = [
        "will section on derivatives be on the exam?",
        "is this pdf format correct for the homework?", 
        "the textbook says that debit is right?",
        "what is Plato's cave in professor's interpretation?",
        "what is the difference between the book and the lecture?",
        "make me a practice exam based on professor's lecture",
    ];
    let currentIndex = 0;

    function updatePlaceholder() {
        searchInput.setAttribute('placeholder', placeholders[currentIndex]);
        currentIndex = (currentIndex + 1) % placeholders.length;
    }

    // Initial setup
    updatePlaceholder();

    // Set interval to change placeholder every 3 seconds
    setInterval(updatePlaceholder, 1500);

    // Clear placeholder on focus
    searchInput.addEventListener('focus', function() {
        this.setAttribute('placeholder', '');
    });

    // Restore placeholder on blur if empty
    searchInput.addEventListener('blur', function() {
        if (this.value === '') {
            updatePlaceholder();
        }
    });
});
