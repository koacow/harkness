from pathlib import Path
import magic
from ..utils.config import UPLOADS_DIR, PROCESSED_DIR

class FileProcessor:
    def __init__(self):
        self.uploads_dir = UPLOADS_DIR
        self.processed_dir = PROCESSED_DIR
        self.supported_types = {
            'application/pdf': '.pdf',
            'text/plain': '.txt',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
        }

    def get_new_files(self):
        """Get list of files that haven't been processed yet"""
        processed_files = {f.stem for f in self.processed_dir.glob("*")}
        return [f for f in self.uploads_dir.glob("*") 
                if f.stem not in processed_files]

    def get_file_type(self, file_path: Path):
        """Detect file type using python-magic"""
        mime = magic.Magic(mime=True)
        file_type = mime.from_file(str(file_path))
        return file_type

    def process_file(self, file_path: Path):
        """Process a single file from uploads directory"""
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_type = self.get_file_type(file_path)
        
        if file_type not in self.supported_types:
            print(f"Unsupported file type {file_type} for file {file_path.name}")
            return False
        
        try:
            # Here you'll add your specific processing logic
            print(f"Processing {file_path.name} of type {file_type}")
            return True
        except Exception as e:
            print(f"Error processing {file_path.name}: {str(e)}")
            return False

    def process_all_new_files(self):
        """Process all new files in the uploads directory"""
        new_files = self.get_new_files()
        results = []
        for file_path in new_files:
            success = self.process_file(file_path)
            results.append((file_path.name, success))
        return results