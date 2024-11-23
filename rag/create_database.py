"""
This code demonstrates the creation of an Enhanced Retrieval-Augmented Generation (RAG) 
data pipeline. It processes multiple document types into chunks, creates vector embeddings 
for these chunks, and stores the embeddings in a vector database called Chroma. 
These embeddings can later be retrieved and used as context for language model queries.
The system includes advanced features like contextual compression and multi-document support.
"""
# This system cannot provide direct answers to homework questions or complete solutions to problems.
# It is designed to guide students towards better understanding and problem-solving skills.

import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv
import shutil
from typing import List, Optional
from langchain_community.document_loaders import (
    DirectoryLoader, 
    PDFMinerLoader,
    CSVLoader,
    UnstructuredMarkdownLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
import argparse
import json
import sys

# Create a separate error logger that writes to stderr
import logging
error_logger = logging.getLogger('error_logger')
handler = logging.StreamHandler(sys.stderr)
error_logger.addHandler(handler)
error_logger.setLevel(logging.INFO)

# Get the current directory (rag folder)
CURRENT_DIR = Path(__file__).parent
CHROMA_PATH = os.path.join(CURRENT_DIR, "chroma")
DATA_PATH = os.path.join(CURRENT_DIR, "data")

_ = load_dotenv(find_dotenv()) # read local .env file
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

class EnhancedRAG:
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        embedding_model: str = "text-embedding-ada-002",
        llm_model: str = "gpt-3.5-turbo",
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.embedding_model = embedding_model
        self.llm_model = llm_model
        self.db = None
        self.retriever = None
        self.qa_chain = None
        
        # Check if Chroma database exists and load it
        if os.path.exists(CHROMA_PATH) and os.listdir(CHROMA_PATH):
            error_logger.info("Loading existing vector store...")
            embeddings = OpenAIEmbeddings(
                openai_api_key=OPENAI_API_KEY,
                model=self.embedding_model
            )
            self.db = Chroma(
                persist_directory=CHROMA_PATH,
                embedding_function=embeddings
            )
            self._initialize_retriever_and_chain()

    def _initialize_retriever_and_chain(self):
        if self.db:
            llm = ChatOpenAI(temperature=0, model=self.llm_model)
            base_retriever = self.db.as_retriever(
                search_kwargs={"k": 4}
            )
            compressor = LLMChainExtractor.from_llm(llm)
            self.retriever = ContextualCompressionRetriever(
                base_compressor=compressor,
                base_retriever=base_retriever
            )
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.retriever,
                return_source_documents=True
            )

    def load_documents(self, file_types: List[str] = ["*.pdf", "*.csv", "*.md", "*.txt"]) -> List[Document]:
        documents = []
        for file_type in file_types:
            try:
                loader = DirectoryLoader(
                    DATA_PATH, 
                    glob=file_type,
                    loader_cls=self._get_loader_class(file_type)
                )
                docs = loader.load()
                documents.extend(docs)
                error_logger.info(f"Loaded {len(docs)} {file_type} documents")
            except Exception as e:
                error_logger.error(f"Error loading {file_type}: {str(e)}")
        
        if not documents:
            error_logger.warning(f"No documents found in {DATA_PATH}")
            
        return documents

    def _get_loader_class(self, file_type: str):
        loaders = {
            "*.pdf": PDFMinerLoader,
            "*.csv": CSVLoader,
            "*.md": UnstructuredMarkdownLoader,
        }
        return loaders.get(file_type, None)

    def split_text(self, documents: List[Document]) -> List[Document]:
        if not documents:
            return []
            
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            add_start_index=True
        )
        
        chunks = splitter.split_documents(documents)
        error_logger.info(f"Split {len(documents)} documents into {len(chunks)} chunks")
        return chunks

    def create_vector_store(self, chunks: List[Document]):
        if not chunks:
            error_logger.warning("No chunks to process. Vector store not created.")
            return
            
        if os.path.exists(CHROMA_PATH):
            shutil.rmtree(CHROMA_PATH)
            
        embeddings = OpenAIEmbeddings(
            openai_api_key=OPENAI_API_KEY,
            model=self.embedding_model
        )
        
        self.db = Chroma.from_documents(
            chunks,
            embeddings,
            persist_directory=CHROMA_PATH
        )
        
        self._initialize_retriever_and_chain()
        error_logger.info(f"Created vector store with {len(chunks)} chunks")

    def query(self, question: str, fetch_k: int = 4) -> dict:
        if not self.qa_chain:
            error_logger.info("Vector store not initialized. Processing documents first...")
            self.process_documents()
            
            if not self.qa_chain:
                return {
                    "answer": "No documents available to answer the question. Please upload some documents first.",
                    "sources": []
                }
        
        # Check if the question is asking for homework answers or complete solutions
        if self._is_homework_question(question):
            return {
                "answer": "I'm sorry, but I can't provide direct answers to homework questions or complete solutions to problems. Instead, I can guide you through the problem-solving process or explain related concepts. Could you rephrase your question to ask about a specific concept or step you're struggling with?",
                "sources": []
            }
        
        error_logger.info(f"Processing question: {question}")
            
        response = self.qa_chain.invoke({
            "query": question,
            "k": fetch_k
        })
        
        # Process the response to ensure it's guiding rather than giving complete answers
        processed_answer = self._process_answer(response["result"])
        
        return {
            "answer": processed_answer,
            "sources": [doc.page_content for doc in response["source_documents"]]
        }

    def _is_homework_question(self, question: str) -> bool:
        # List of keywords that might indicate a homework question
        homework_keywords = ["homework", "assignment", "problem set", "answer to", "solution for"]
        return any(keyword in question.lower() for keyword in homework_keywords)

    def _process_answer(self, answer: str) -> str:
        # Add a disclaimer to the beginning of the answer
        disclaimer = "Here's some guidance to help you understand this topic better: "
        
        # Ensure the answer doesn't give away too much
        max_length = 500  # Adjust this value as needed
        if len(answer) > max_length:
            answer = answer[:max_length] + "... (continued)"
        
        return disclaimer + answer

    def process_documents(self, file_types: Optional[List[str]] = None):
        error_logger.info("Starting document processing...")
        
        if file_types is None:
            file_types = ["*.pdf", "*.csv", "*.md", "*.txt"]
            
        try:
            documents = self.load_documents(file_types)
            chunks = self.split_text(documents)
            self.create_vector_store(chunks)
            error_logger.info("Document processing completed successfully!")
        except Exception as e:
            error_logger.error(f"Error during document processing: {str(e)}")
            raise

def parse_arguments():
    parser = argparse.ArgumentParser(description='Enhanced RAG System')
    parser.add_argument('--process', action='store_true', help='Process documents in data directory')
    parser.add_argument('--query', type=str, help='Query to ask the RAG system')
    parser.add_argument('--file', type=str, help='Specific file to process')
    return parser.parse_args()

def main():
    args = parse_arguments()
    rag = EnhancedRAG(chunk_size=1000, chunk_overlap=200)
    
    if args.process or args.file:
        rag.process_documents()
        
    if args.query:
        result = rag.query(args.query)
        # Print only the JSON result to stdout
        print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()