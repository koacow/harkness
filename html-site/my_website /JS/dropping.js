document.addEventListener('DOMContentLoaded', function() {
    const customSelect = document.querySelector('.custom-select');
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const schoolLogo = document.getElementById('schoolLogo');
    const goToSchoolBtn = document.getElementById('goToSchoolBtn');

    // Style improvements
    customSelect.style.position = 'relative';
    customSelect.style.width = '80%';
    customSelect.style.margin = '0 auto';
    customSelect.style.maxWidth = '400px';

    selectSelected.style.backgroundColor = '#fff';
    selectSelected.style.padding = '15px 20px';
    selectSelected.style.borderRadius = '8px';
    selectSelected.style.border = '2px solid #e2e8f0';
    selectSelected.style.cursor = 'pointer';
    selectSelected.style.transition = 'all 0.3s ease';

    selectItems.style.position = 'absolute';
    selectItems.style.top = '100%';
    selectItems.style.left = '0';
    selectItems.style.right = '0';
    selectItems.style.zIndex = '99';
    selectItems.style.maxHeight = '300px';
    selectItems.style.overflowY = 'auto';
    selectItems.style.backgroundColor = '#fff';
    selectItems.style.borderRadius = '8px';
    selectItems.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    selectItems.style.marginTop = '5px';
    selectItems.style.display = 'none';  // Hide by default

    // Style all option divs
    const optionDivs = selectItems.getElementsByTagName('div');
    Array.from(optionDivs).forEach(div => {
        div.style.padding = '12px 20px';
        div.style.cursor = 'pointer';
        div.style.transition = 'background-color 0.2s';
        
        div.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f7fafc';
        });
        
        div.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#fff';
        });
    });

    // Toggle dropdown
    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        selectItems.style.display = selectItems.style.display === 'none' ? 'block' : 'none';
        this.classList.toggle('select-arrow-active');
        
        if (selectItems.style.display === 'block') {
            this.style.borderColor = '#4a90e2';
            this.style.boxShadow = '0 0 0 3px rgba(74,144,226,0.2)';
        } else {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        }
    });

    // Handle school selection and logo display
    selectItems.addEventListener('click', function(e) {
        if (e.target.hasAttribute('data-value')) {
            const school = e.target.getAttribute('data-value');
            selectSelected.textContent = e.target.textContent;
            selectItems.style.display = 'none';
            selectSelected.classList.remove('select-arrow-active');
            selectSelected.style.borderColor = '#e2e8f0';
            selectSelected.style.boxShadow = 'none';
            
            // Update logo
            schoolLogo.style.display = 'block';
            schoolLogo.style.width = '150px';
            schoolLogo.style.height = '150px';
            schoolLogo.style.margin = '20px auto';
            schoolLogo.style.backgroundSize = 'contain';
            schoolLogo.style.backgroundRepeat = 'no-repeat';
            schoolLogo.style.backgroundPosition = 'center';
            schoolLogo.style.transition = 'opacity 0.3s';
            
            // Map of school codes to logo image paths
            const schoolLogos = {
                'brown': 'images/brown.jpg',
                'caltech': 'images/cal.png', 
                'cmu': 'images/cmu.jpeg',
                'chicago': 'images/chicago.webp',
                'columbia': 'images/columbia.webp',
                'cornell': 'images/cornell-university-logo.png',
                'dartmouth': 'images/dartmouth.webp',
                'duke': 'images/duke.webp',
                'harvard': 'images/harvard.png',
                'jhu': 'images/johnshopkins.png',
                'mit': 'images/mit.webp',
                'nyu': 'images/nyu.webp',
                'northwestern': 'images/northwestern.webp',
                'princeton': 'images/princeton.png',
                'berkeley': 'images/uc-berkeley.png',
                'ucla': 'images/ucla.jpg',
                'ucsd': 'images/ucsd.png',
                'umich': 'images/michigan.png',
                'upenn': 'images/penn.png',
                'yale': 'images/yale.webp'
            };

            // Add a CSS class for uniform school logo sizing
            const style = document.createElement('style');
            style.textContent = `
                .school-logo-image {
                    width: 150px;
                    height: 150px;
                    object-fit: contain;
                    display: block;
                    margin: 20px auto;
                }
            `;
            document.head.appendChild(style);

            // Set school logo using the mapping
            schoolLogo.style.backgroundImage = `url('${schoolLogos[school]}')`;

            // Enable the "Go to School Page" button
            goToSchoolBtn.disabled = false;
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        selectItems.style.display = 'none';
        selectSelected.classList.remove('select-arrow-active');
        selectSelected.style.borderColor = '#e2e8f0';
        selectSelected.style.boxShadow = 'none';
    });

    // Handle "Go to School Page" button click
    goToSchoolBtn.addEventListener('click', function() {
        const selectedSchool = selectSelected.textContent;
        if (selectedSchool !== 'Select your school') {
            const schoolValue = Array.from(optionDivs).find(div => div.textContent === selectedSchool).getAttribute('data-value');
            window.location.href = `${schoolValue}.html`; // Remove -login suffix since files are named like harvard.html
        } else {
            alert('Please select a school before proceeding.');
        }
    });

    // Initially disable the "Go to School Page" button
    goToSchoolBtn.disabled = true;
});