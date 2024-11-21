//this is the javascript for the university-specific HTML pages
document.addEventListener('DOMContentLoaded', function() {
    const classDropdown = document.getElementById('classDropdown');

    // Add hover effect
    classDropdown.addEventListener('mouseover', function() {
        this.classList.add('hover');
    });

    classDropdown.addEventListener('mouseout', function() {
        if (this !== document.activeElement) {
            this.classList.remove('hover');
        }
    });

    // Add focus effect
    classDropdown.addEventListener('focus', function() {
        this.classList.add('focused');
    });

    classDropdown.addEventListener('blur', function() {
        this.classList.remove('focused');
        this.classList.remove('hover');
    });

    // Check if MathJax is loaded
    if (typeof window.MathJax === 'undefined') {
        // Add MathJax configuration and script loading
        const mathJaxConfig = document.createElement('script');
        mathJaxConfig.text = `
            window.MathJax = {
                tex: {
                    inlineMath: [['\\\\(', '\\\\)']],
                    displayMath: [['\\\\[', '\\\\]']],
                    processEscapes: true,
                },
                svg: {
                    fontCache: 'global'
                },
                options: {
                    renderActions: {
                        addMenu: [0, '', '']
                    }
                },
                startup: {
                    pageReady: () => {
                        return Promise.resolve();
                    }
                }
            };
        `;
        document.head.appendChild(mathJaxConfig);

        const mathJaxScript = document.createElement('script');
        mathJaxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-mml-chtml.js';
        mathJaxScript.async = true;
        document.head.appendChild(mathJaxScript);
    }
});
// Add change event listener to class dropdown
document.getElementById('classDropdown').addEventListener('change', function() { 
    // Get the selected class name and university name
    const selectedClass = this.options[this.selectedIndex].text;
    
    // Get university name from the current page URL
    const currentUrl = window.location.pathname;
    const universityCode = currentUrl.split('/').pop().replace('.html', '');
    const universityMap = {
        'harvard': 'Harvard',
        'yale': 'Yale',
        'mit': 'MIT',
        'princeton': 'Princeton',
        'brown': 'Brown',
        'caltech': 'Caltech',
        'cmu': 'Carnegie Mellon',
        'chicago': 'Chicago',
        'columbia': 'Columbia',
        'cornell': 'Cornell',
        'dartmouth': 'Dartmouth',
        'duke': 'Duke',
        'jhu': 'Johns Hopkins',
        'nyu': 'NYU',
        'northwestern': 'Northwestern',
        'berkeley': 'UC Berkeley',
        'ucla': 'UCLA',
        'ucsd': 'UC San Diego',
        'umich': 'Michigan',
        'upenn': 'UPenn'
    };
    const universityName = universityMap[universityCode] || 'University';
    
    // Create a new element for the typing animation
    const typingElement = document.createElement('h2');
    typingElement.className = 'typing-animation';
    typingElement.style.position = 'absolute';
    typingElement.style.top = '40%';
    typingElement.style.left = '50%';
    typingElement.style.transform = 'translate(-50%, -50%)';
    typingElement.style.fontFamily = "'Playfair Display', serif";
    typingElement.style.fontSize = '2.5em';
    typingElement.style.color = '#333';
    typingElement.style.textAlign = 'center';
    typingElement.style.width = '100%';
    typingElement.style.transition = 'top 0.5s ease-in-out';
    
    // Append the new element to the body
    document.body.appendChild(typingElement);
    
    // Hide the class dropdown section
    const classDropdownSection = document.querySelector('.class-dropdown-section');
    classDropdownSection.style.transition = 'opacity 0.3s ease';
    classDropdownSection.style.opacity = '0';
    setTimeout(() => {
        classDropdownSection.style.display = 'none';
    }, 300);
    
    // Typing animation function
    function typeText(text, index = 0) {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            setTimeout(() => typeText(text, index + 1), 50);
        } else {
            // After typing is complete, animate to the top
            setTimeout(() => {
                typingElement.style.top = '10%';
            }, 500);
            // Then show the search box
            setTimeout(showSearchBox, 1000);
        }
    }
    
    // Start the typing animation
    setTimeout(() => {
        typeText(`Your ${universityName} ${selectedClass}`);
    }, 500);

    // Function to show the search box
    function showSearchBox() {
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <input type="text" id="searchInput" placeholder="Ask your virtual professor about ${selectedClass}">
            <button id="searchButton">Ask</button>
        `;
        searchBox.style.position = 'fixed';
        searchBox.style.bottom = '20px';
        searchBox.style.left = '50%';
        searchBox.style.transform = 'translateX(-50%)';
        searchBox.style.width = '90%';
        searchBox.style.maxWidth = '800px';
        searchBox.style.display = 'flex';
        searchBox.style.alignItems = 'center';
        searchBox.style.backgroundColor = 'white';
        searchBox.style.borderRadius = '24px';
        searchBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        searchBox.style.overflow = 'hidden';
        searchBox.style.transition = 'all 0.3s ease';

        document.body.appendChild(searchBox);

        const searchInput = searchBox.querySelector('#searchInput');
        searchInput.style.flex = '1';
        searchInput.style.border = 'none';
        searchInput.style.padding = '15px 20px';
        searchInput.style.fontSize = '18px';
        searchInput.style.fontFamily = "'Lora', serif";
        searchInput.style.outline = 'none';
        searchInput.style.backgroundColor = '#f5f5f5';
        searchInput.style.transition = 'background-color 0.3s ease';

        const searchButton = searchBox.querySelector('#searchButton');
        searchButton.style.border = 'none';
        searchButton.style.backgroundColor = '#4a90e2';
        searchButton.style.color = 'white';
        searchButton.style.padding = '15px 30px';
        searchButton.style.fontSize = '18px';
        searchButton.style.fontFamily = "'Lora', serif";
        searchButton.style.cursor = 'pointer';
        searchButton.style.transition = 'background-color 0.3s ease';
        searchButton.style.marginLeft = '10px';
        searchButton.style.borderRadius = '20px';

        searchButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#3a7bc8';
        });
        searchButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4a90e2';
        });
        
        const outputBox = document.createElement('div');
        outputBox.className = 'output-box';
        outputBox.style.position = 'absolute';
        outputBox.style.top = '150px';
        outputBox.style.left = '50%';
        outputBox.style.transform = 'translateX(-50%)';
        outputBox.style.width = '70%'; // Controls the width of the output box
        outputBox.style.maxWidth = '1000px'; // Also controls the width of the output box
        outputBox.style.height = '80vh';
        outputBox.style.overflowY = 'auto';
        outputBox.style.backgroundColor = 'white';
        outputBox.style.borderRadius = '10px';
        outputBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        outputBox.style.padding = '20px';
        outputBox.style.display = 'none';
        outputBox.style.transition = 'all 0.3s ease';
        outputBox.style.fontFamily = "'Lora', serif";
        outputBox.style.fontSize = '16px'; // Reduced font size for the output box
        document.body.appendChild(outputBox);

        function handleUserInput() {
            const userInput = searchInput.value;
            if (userInput.trim()) {
                outputBox.style.display = 'block';
                const userInputDisplay = document.createElement('div');
                userInputDisplay.textContent = `You: ${userInput}`;
                userInputDisplay.style.marginBottom = '15px';
                userInputDisplay.style.color = '#333';
                userInputDisplay.style.padding = '10px';
                userInputDisplay.style.backgroundColor = '#f0f0f0';
                userInputDisplay.style.borderRadius = '10px';
                userInputDisplay.style.fontSize = '14px'; // Reduced font size for user input
                outputBox.appendChild(userInputDisplay);
                
                // Create loading animation for this specific question
                const loadingAnimation = document.createElement('div');
                loadingAnimation.className = 'loading-animation';
                loadingAnimation.innerHTML = `
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading...</div>
                `;
                loadingAnimation.style.display = 'flex';
                loadingAnimation.style.justifyContent = 'center';
                loadingAnimation.style.alignItems = 'center';
                loadingAnimation.style.marginTop = '10px';
                outputBox.appendChild(loadingAnimation);
                
                searchInput.value = '';
                sendToBackend(userInput, loadingAnimation);
            }
        }

        searchButton.addEventListener('click', handleUserInput);

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });

        // Enhanced MathJax content handling function
        async function handleMathContent(responseElement, content) {
            // Set the content
            responseElement.innerHTML = content;

            // Force MathJax to re-render the content
            if (window.MathJax) {
                try {
                    // Make sure MathJax is ready
                    if (window.MathJax.typesetPromise) {
                        // Clear the math jax buffer for this element
                        if (window.MathJax.typesetClear) {
                            window.MathJax.typesetClear([responseElement]);
                        }
                        
                        // Typeset the new content
                        await window.MathJax.typesetPromise([responseElement]);
                    } else {
                        console.warn('MathJax.typesetPromise not available, waiting for MathJax to load...');
                        // Wait for MathJax to be fully loaded
                        await new Promise(resolve => {
                            const checkMathJax = setInterval(() => {
                                if (window.MathJax.typesetPromise) {
                                    clearInterval(checkMathJax);
                                    window.MathJax.typesetPromise([responseElement]).then(resolve);
                                }
                            }, 100);
                        });
                    }
                } catch (err) {
                    console.error('MathJax rendering error:', err);
                    responseElement.innerHTML += '<div style="color: red; margin-top: 10px;">Error rendering mathematical notation</div>';
                }
            } else {
                console.error('MathJax not found');
                responseElement.innerHTML += '<div style="color: red; margin-top: 10px;">Mathematical notation renderer not available</div>';
            }
        }

        // Enhanced content formatting function with improved math handling
        function formatContent(content) {
            // Protect math content before other formatting
            const mathMap = new Map();
            let mathCounter = 0;

            // Store block math
            content = content.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
                const id = `__BLOCK_MATH_${mathCounter++}__`;
                mathMap.set(id, `\\[${math}\\]`);
                return id;
            });

            // Store inline math
            content = content.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
                const id = `__INLINE_MATH_${mathCounter++}__`;
                mathMap.set(id, `\\(${math}\\)`);
                return id;
            });

            // Handle code blocks with language-specific formatting
            content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
                language = language || '';
                const formattedCode = formatCodeBlock(code, language);
                return `
                    <div class="code-block-container">
                        ${language ? `<div class="code-language">${language}</div>` : ''}
                        <pre class="code-block ${language}"><code>${formattedCode}</code></pre>
                        <button class="copy-button" onclick="copyCode(this)">Copy</button>
                    </div>
                `;
            });

            // Handle inline code
            content = content.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

            // Apply other formatting (existing code)
            content = content.replace(/\n/g, '<br>');
            content = content.replace(/#{1,6}\s+(.+)/g, (match, p1) => {
                const level = match.trim().split(' ')[0].length;
                return `<h${level} style="margin-top: 20px; margin-bottom: 10px; font-weight: bold; font-size: ${22 - level * 2}px;">${p1}</h${level}>`;
            });

            // Format bold text
            content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

            // Format italic text
            content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');

            // Format unordered lists
            content = content.replace(/^\s*[-*+]\s+(.+)/gm, '<li style="margin-left: 20px; font-size: 14px;">$1</li>');
            content = content.replace(/(<li[^>]*>.*<\/li>)\s*(?=<li|$)/gs, '<ul style="margin-top: 10px; margin-bottom: 10px;">$1</ul>');

            // Format ordered lists
            content = content.replace(/^\s*(\d+)\.\s+(.+)/gm, '<li style="margin-left: 20px; font-size: 14px;">$2</li>');
            content = content.replace(/(<li[^>]*>.*<\/li>)\s*(?=<li|$)/gs, '<ol style="margin-top: 10px; margin-bottom: 10px;">$1</ol>');

            // Restore math content
            mathMap.forEach((math, id) => {
                content = content.replace(id, math);
            });

            return content;
        }

        // Add helper function for code formatting
        function formatCodeBlock(code, language) {
            let formattedCode = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Add syntax highlighting based on language
            switch (language.toLowerCase()) {
                case 'python':
                    formattedCode = highlightPython(formattedCode);
                    break;
                case 'smiles':
                    formattedCode = highlightSmiles(formattedCode);
                    break;
                case 'inchi':
                    formattedCode = highlightInChI(formattedCode);
                    break;
                // Add more language cases as needed
            }

            return formattedCode;
        }

        // Add syntax highlighting functions
        function highlightPython(code) {
            const keywords = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'while', 'try', 'except'];
            const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict'];
            const chemLibs = ['rdkit', 'mol', 'Chem', 'AllChem', 'Draw', 'Descriptors'];

            code = code.replace(
                new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'),
                '<span class="keyword">$1</span>'
            );
            code = code.replace(
                new RegExp(`\\b(${builtins.join('|')})\\b`, 'g'),
                '<span class="builtin">$1</span>'
            );
            code = code.replace(
                new RegExp(`\\b(${chemLibs.join('|')})\\b`, 'g'),
                '<span class="chem-keyword">$1</span>'
            );
            // Add more syntax highlighting rules as needed
            return code;
        }

        function highlightSmiles(code) {
            // Highlight SMILES notation specific patterns
            return code.replace(
                /(\[.*?\])|(\(.*?\))|([=#@\\\/\-\+])/g,
                (match) => `<span class="smiles-special">${match}</span>`
            );
        }

        function highlightInChI(code) {
            // Implement InChI highlighting if needed
            return code;
        }

        // Add copy functionality
        function copyCode(button) {
            const codeBlock = button.parentElement.querySelector('code');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }

        // Update the sendToBackend function
        async function sendToBackend(userInput, loadingAnimation) {
            try {
                // Show loading animation
                loadingAnimation.style.display = 'flex';
                
                const response = await fetch('http://localhost:3001/api/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        messages: [
                            { role: "user", content: userInput }
                        ]
                    })
                });

                // Hide loading animation
                loadingAnimation.style.display = 'none';

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                const responseElement = document.createElement('div');
                responseElement.style.marginBottom = '15px';
                responseElement.style.padding = '10px';
                responseElement.style.backgroundColor = '#e6f2ff';
                responseElement.style.borderRadius = '10px';
                responseElement.style.lineHeight = '1.6';
                responseElement.style.fontSize = '14px'; // Reduced font size for response
                responseElement.style.fontFamily = "'Lora', serif";
                outputBox.appendChild(responseElement);

                // Format and handle math content rendering
                const formattedContent = formatContent(data.content);
                await handleMathContent(responseElement, formattedContent);

                // Scroll to the bottom of the output box
                outputBox.scrollTop = outputBox.scrollHeight;

            } catch (error) {
                // Hide loading animation on error
                loadingAnimation.style.display = 'none';
                
                console.error('Error:', error);
                const errorElement = document.createElement('div');
                errorElement.textContent = `Error: ${error.message}`;
                errorElement.style.color = 'white';
                errorElement.style.backgroundColor = '#ff4d4d';
                errorElement.style.padding = '10px';
                errorElement.style.borderRadius = '10px';
                errorElement.style.marginBottom = '15px';
                errorElement.style.fontFamily = "'Lora', serif";
                errorElement.style.fontSize = '14px'; // Reduced font size for error messages
                outputBox.appendChild(errorElement);
                
                // Scroll to the bottom of the output box
                outputBox.scrollTop = outputBox.scrollHeight;
            }
        }
    }
});
