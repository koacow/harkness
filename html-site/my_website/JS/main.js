document.addEventListener('DOMContentLoaded', function() {
    // Typing effect for the title
    const text = "Welcome to Harkness";
    const titleElement = document.querySelector('.harkness-title');
    let index = 0;

    function typeText() {
        if (index < text.length) {
            titleElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        } else {
            // Add a blinking cursor effect after typing
            titleElement.classList.add('blinking-cursor');
        }
    }

    typeText();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-button');
    const welcomeContent = document.querySelector('.welcome-content');
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

    updatePlaceholder();
    setInterval(updatePlaceholder, 3000);

    searchInput.addEventListener('focus', function() {
        this.setAttribute('placeholder', '');
    });

    searchInput.addEventListener('blur', function() {
        if (this.value === '') {
            updatePlaceholder();
        }
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            welcomeContent.innerHTML = `<h2>Searching for: "${query}"</h2><p>Loading results...</p>`;
            welcomeContent.classList.add('fade-in');
            // Simulating search delay
            setTimeout(() => {
                welcomeContent.innerHTML = `
                    <h2>Results for: "${query}"</h2>
                    <p>This is where the search results would appear.</p>
                    <div class="search-result">
                        <h3>Related Topic 1</h3>
                        <p>Brief explanation or excerpt...</p>
                    </div>
                    <div class="search-result">
                        <h3>Related Topic 2</h3>
                        <p>Brief explanation or excerpt...</p>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 20px;">
                        <button onclick="window.location.href='professor-login.html'" id="startProfessorBtn" class="role-button">Start as Professor!</button>
                        <button onclick="window.location.href='student-login.html'" id="startStudentBtn" class="role-button">Start as Student!</button>
                    </div>
                `;
                welcomeContent.classList.remove('fade-in');
                
                // Add event listener to the new "Start Now!" button
                document.getElementById('startNowBtn').addEventListener('click', function() {
                    window.location.href = 'gen_login.html';
                });
            }, 1500);

            // TODO: Implement ChatGPT API call here
            // const response = await callChatGPTAPI(query);
            // Update welcomeContent with the response from ChatGPT
        }
    }

    // Interactive features section
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseover', function() {
            this.classList.add('feature-highlight');
        });
        feature.addEventListener('mouseout', function() {
            this.classList.remove('feature-highlight');
        });
    });

    // CTA button effects
    const ctaButton = document.querySelector('.role-button');
    ctaButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });
    ctaButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
    ctaButton.addEventListener('click', function() {
        this.classList.add('button-click');
        setTimeout(() => this.classList.remove('button-click'), 200);
    });

    // Scroll-triggered animations
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.feature, .cta-buttons');
        elements.forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('animate-in');
            }
        });
    }

    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Check on load as well
});