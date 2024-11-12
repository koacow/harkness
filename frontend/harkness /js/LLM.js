
document.addEventListener('DOMContentLoaded', function() {
    const classDropdown = document.getElementById('classDropdown');
    const dropdownSection = document.querySelector('.class-dropdown-section');
    const dropdownContainer = document.querySelector('.class-dropdown-container');
    const classTitle = document.querySelector('.class-title');

    // Style the dropdown section
    dropdownSection.style.display = 'flex';
    dropdownSection.style.flexDirection = 'column';
    dropdownSection.style.alignItems = 'center';
    dropdownSection.style.justifyContent = 'center';
    dropdownSection.style.minHeight = '60vh';
    dropdownSection.style.padding = '40px 20px';

    // Style the class title
    classTitle.style.fontFamily = "'Merriweather', serif";
    classTitle.style.color = '#333';
    classTitle.style.fontSize = '2.2em';
    classTitle.style.marginBottom = '30px';
    classTitle.style.textAlign = 'center';
    classTitle.style.textShadow = '1px 1px 2px rgba(0,0,0,0.1)';

    // Style the dropdown container
    dropdownContainer.style.width = '100%';
    dropdownContainer.style.maxWidth = '400px';
    dropdownContainer.style.margin = '0 auto';
    dropdownContainer.style.position = 'relative';

    // Style the dropdown
    classDropdown.style.width = '100%';
    classDropdown.style.padding = '12px 20px';
    classDropdown.style.fontSize = '16px';
    classDropdown.style.fontFamily = "'Arial', sans-serif";
    classDropdown.style.border = '1px solid #ced4da';
    classDropdown.style.borderRadius = '8px';
    classDropdown.style.backgroundColor = 'white';
    classDropdown.style.cursor = 'pointer';
    classDropdown.style.transition = 'all 0.3s ease';
    classDropdown.style.appearance = 'none';
    classDropdown.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    classDropdown.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg fill=\"%23495057\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')";
    classDropdown.style.backgroundRepeat = 'no-repeat';
    classDropdown.style.backgroundPosition = 'right 10px center';
    classDropdown.style.backgroundSize = '20px';

    // Add hover effect
    classDropdown.addEventListener('mouseover', function() {
        this.style.borderColor = '#6c757d';
        this.style.boxShadow = '0 2px 8px rgba(108, 117, 125, 0.2)';
    });

    classDropdown.addEventListener('mouseout', function() {
        if (this !== document.activeElement) {
            this.style.borderColor = '#ced4da';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
    });

    // Add focus effect
    classDropdown.addEventListener('focus', function() {
        this.style.outline = 'none';
        this.style.borderColor = '#6c757d';
        this.style.boxShadow = '0 0 0 3px rgba(108, 117, 125, 0.3)';
    });

    classDropdown.addEventListener('blur', function() {
        this.style.borderColor = '#ced4da';
        this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    });

    // Style dropdown options
    const options = classDropdown.querySelectorAll('option');
    options.forEach(option => {
        option.style.padding = '10px';
        option.style.fontSize = '16px';
    });

    // Add custom styling for the dropdown arrow
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.top = '50%';
    arrow.style.right = '15px';
    arrow.style.transform = 'translateY(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '6px solid transparent';
    arrow.style.borderRight = '6px solid transparent';
    arrow.style.borderTop = '6px solid #495057';
    arrow.style.pointerEvents = 'none';
    dropdownContainer.appendChild(arrow);
});
// Add change event listener to class dropdown
document.getElementById('classDropdown').addEventListener('change', function() { 
    // Get the selected class name
    const selectedClass = this.options[this.selectedIndex].text;
    
    // Create a new element for the typing animation
    const typingElement = document.createElement('h2');
    typingElement.className = 'typing-animation';
    typingElement.style.position = 'absolute';
    typingElement.style.top = '40%';
    typingElement.style.left = '50%';
    typingElement.style.transform = 'translate(-50%, -50%)';
    typingElement.style.fontFamily = "'Merriweather', serif";
    typingElement.style.fontSize = '2em';
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
        typeText(`Your Harvard ${selectedClass}`);
    }, 500);

    // Function to show the search box
    function showSearchBox() {
        const searchBox = document.createElement('div');
        searchBox.innerHTML = `
            <input type="text" id="searchInput" placeholder="Ask your virtual professor about ${selectedClass}">
            <button id="searchButton">Ask</button>
        `;
        searchBox.style.position = 'fixed';
        searchBox.style.bottom = '20px';
        searchBox.style.left = '50%';
        searchBox.style.transform = 'translateX(-50%)';
        searchBox.style.width = '80%';
        searchBox.style.maxWidth = '600px';
        searchBox.style.padding = '10px';
        searchBox.style.backgroundColor = 'white';
        searchBox.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        searchBox.style.borderRadius = '30px';
        searchBox.style.display = 'flex';
        searchBox.style.justifyContent = 'space-between';
        searchBox.style.alignItems = 'center';

        document.body.appendChild(searchBox);

        // Add styles for input and button
        const searchInput = searchBox.querySelector('#searchInput');
        searchInput.style.flex = '1';
        searchInput.style.padding = '15px 20px';
        searchInput.style.fontSize = '16px';
        searchInput.style.border = 'none';
        searchInput.style.borderRadius = '30px';
        searchInput.style.backgroundColor = '#f0f0f0';
        searchInput.style.outline = 'none';

        const searchButton = searchBox.querySelector('#searchButton');
        searchButton.style.padding = '12px 25px';
        searchButton.style.fontSize = '16px';
        searchButton.style.backgroundColor = '#4a90e2';
        searchButton.style.color = 'white';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '25px';
        searchButton.style.cursor = 'pointer';
        searchButton.style.marginLeft = '10px';
        searchButton.style.transition = 'background-color 0.3s ease';

        // Add hover effect to the button
        searchButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#3a7bc8';
        });
        searchButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#4a90e2';
        });
        
    }
});

// now the real shit starts LLMMMMMMM 




