// Style the upload form container
const uploadForm = document.getElementById('uploadForm');
uploadForm.style.maxWidth = '800px';
uploadForm.style.margin = '40px auto';
uploadForm.style.padding = '40px';
uploadForm.style.backgroundColor = '#f8f9fa';
uploadForm.style.borderRadius = '12px';
uploadForm.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';

// Create drag and drop area
const dragDropArea = document.createElement('div');
dragDropArea.id = 'dragDropArea';
dragDropArea.innerHTML = `
    <div style="
        border: 3px dashed #4a90e2;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
    ">
        <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #4a90e2; margin-bottom: 20px;"></i>
        <p style="font-size: 18px; color: #495057; margin-bottom: 10px;">Drag & Drop files here</p>
        <p style="font-size: 14px; color: #6c757d;">or</p>
        <button id="browseButton" style="
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        ">Browse Files</button>
    </div>
`;
uploadForm.insertBefore(dragDropArea, uploadForm.firstChild);

// Style the file input
const fileInput = document.getElementById('fileInput');
fileInput.style.display = 'none'; // Hide the default input
fileInput.setAttribute('multiple', ''); // Allow multiple file selection

// Create file list container
const fileListContainer = document.createElement('div');
fileListContainer.id = 'fileList';
fileListContainer.style.marginTop = '30px';
fileListContainer.style.maxHeight = '300px';
fileListContainer.style.overflowY = 'auto';
fileListContainer.style.padding = '15px';
fileListContainer.style.backgroundColor = 'white';
fileListContainer.style.borderRadius = '8px';
fileListContainer.style.border = '1px solid #dee2e6';
uploadForm.insertBefore(fileListContainer, uploadForm.lastElementChild);

// Create upload button
const uploadButton = document.querySelector('#uploadForm button[type="submit"]');
uploadButton.style.padding = '15px 30px';
uploadButton.style.backgroundColor = '#28a745';
uploadButton.style.color = 'white';
uploadButton.style.border = 'none';
uploadButton.style.borderRadius = '8px';
uploadButton.style.cursor = 'pointer';
uploadButton.style.fontSize = '18px';
uploadButton.style.transition = 'background-color 0.3s ease';
uploadButton.style.display = 'block';
uploadButton.style.margin = '30px auto 0';
uploadButton.style.width = '200px';
uploadButton.textContent = 'Upload Now';

// Event listeners
document.getElementById('browseButton').addEventListener('click', () => {
    fileInput.click();
});

dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.style.backgroundColor = '#e6f2ff';
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.style.backgroundColor = 'transparent';
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.style.backgroundColor = 'transparent';
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    fileListContainer.innerHTML = ''; // Clear previous list
    
    if (files.length > 0) {
        for (let file of files) {
            const fileItem = document.createElement('div');
            fileItem.style.padding = '10px';
            fileItem.style.borderBottom = '1px solid #dee2e6';
            fileItem.style.display = 'flex';
            fileItem.style.alignItems = 'center';
            fileItem.style.justifyContent = 'space-between';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileName.style.color = '#495057';
            
            const fileSize = document.createElement('span');
            fileSize.textContent = formatFileSize(file.size);
            fileSize.style.color = '#6c757d';
            fileSize.style.fontSize = '0.9em';
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileListContainer.appendChild(fileItem);
        }
    }
}

// Hover effects
document.getElementById('browseButton').addEventListener('mouseover', (e) => {
    e.target.style.backgroundColor = '#357abd';
});

document.getElementById('browseButton').addEventListener('mouseout', (e) => {
    e.target.style.backgroundColor = '#4a90e2';
});

uploadButton.addEventListener('mouseover', () => {
    uploadButton.style.backgroundColor = '#218838';
});

uploadButton.addEventListener('mouseout', () => {
    uploadButton.style.backgroundColor = '#28a745';
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Add form submission handler
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const files = fileInput.files;
    
    // Add all files to FormData
    for (let file of files) {
        formData.append('files', file);
    }
    
    try {
        uploadButton.textContent = 'Uploading...';
        uploadButton.disabled = true;
        
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Files uploaded successfully!');
            fileListContainer.innerHTML = '';
            fileInput.value = '';
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        alert('Error uploading files: ' + error.message);
    } finally {
        uploadButton.textContent = 'Upload Now';
        uploadButton.disabled = false;
    }
});
