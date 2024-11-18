const fs = require('fs');
const path = require('path');

// Load university data
const universityData = require('../data/university-classes.json');

// Default classes for universities that don't have specific classes defined
const defaultClasses = [
    { value: 'cs101', name: 'Introduction to Computer Science' },
    { value: 'math101', name: 'Calculus I' },
    { value: 'phys101', name: 'Physics I' },
    { value: 'chem101', name: 'General Chemistry' },
    { value: 'bio101', name: 'Introduction to Biology' },
    { value: 'eng101', name: 'English Composition' },
    { value: 'hist101', name: 'World History' },
    { value: 'econ101', name: 'Principles of Economics' },
    { value: 'psych101', name: 'Introduction to Psychology' },
    { value: 'phil101', name: 'Introduction to Philosophy' }
];

// University mapping (from your existing code)
const universities = {
    'brown': 'Brown University',
    'caltech': 'California Institute of Technology',
    'cmu': 'Carnegie Mellon University',
    'chicago': 'Chicago University',
    'columbia': 'Columbia University',
    'cornell': 'Cornell University',
    'dartmouth': 'Dartmouth College',
    'duke': 'Duke University',
    'harvard': 'Harvard University',
    'jhu': 'Johns Hopkins University',
    'mit': 'Massachusetts Institute of Technology',
    'nyu': 'New York University',
    'northwestern': 'Northwestern University',
    'princeton': 'Princeton University',
    'berkeley': 'University of California, Berkeley',
    'ucla': 'University of California, Los Angeles',
    'ucsd': 'University of California, San Diego',
    'umich': 'University of Michigan',
    'upenn': 'University of Pennsylvania',
    'yale': 'Yale University'
};

// HTML template
const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{UNIVERSITY_NAME}</title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="CSS/style1.css">
    <link rel="stylesheet" href="CSS/classes.css">
    <script src="JS/LLM.js" defer></script>
</head>
<body>
    <header>
        <div class="logo">
            <!--TODO: Add Harkness Logo-->
        </div>
        <a href="index.html" class="nav-title">Harkness</a>
    </header>

    <main>
        <div class="class-dropdown-section">
            <div class="class-selection-container">
                <h2 class="class-title">Select Your Class</h2>
                <div class="class-dropdown-container">
                    <select id="classDropdown" class="class-dropdown">
                        <option value="" disabled selected>Choose a class...</option>
                        {CLASS_OPTIONS}
                    </select>
                </div>
            </div>
        </div>

        <div class="output-box">
            <div class="loading-animation" hidden>
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        </div>
    </main>
</body>
</html>`;

// Ensure output directory exists
const outputDir = path.join(__dirname, '../../public');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate pages for all universities
Object.entries(universities).forEach(([shortName, fullName]) => {
    let page = template;
    
    // Replace university name
    page = page.replace('{UNIVERSITY_NAME}', fullName);
    
    // Get university-specific classes or use default classes
    const classes = universityData[shortName]?.classes || defaultClasses;
    
    // Generate class options
    const classOptions = classes
        .map(cls => `                        <option value="${cls.value}">${cls.name}</option>`)
        .join('\n');
    
    // Replace class options
    page = page.replace('{CLASS_OPTIONS}', classOptions);
    
    // Write the file to public directory
    const outputPath = path.join(outputDir, `${shortName}.html`);
    fs.writeFileSync(outputPath, page);
    console.log(`Generated ${shortName}.html`);
});

console.log('All university pages generated successfully!');