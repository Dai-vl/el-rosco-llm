import argparse
from dotenv import load_dotenv
import os
from openai import OpenAI

# Create the parser
parser = argparse.ArgumentParser(description='Upload a jsonl file for fine-tuning')

# Add an argument
parser.add_argument('File', type=str, help='The name of the file.')

# Parse the arguments
args = parser.parse_args()

# Load .env file
load_dotenv()

# Get API_KEY
apiKey = os.getenv("API_KEY")

client = OpenAI(api_key=apiKey)

file_path = "./data/" + args.File + ".jsonl"

response = client.files.create(
  file=open(file_path, "rb"),
  purpose="fine-tune"
)

print("Data uploaded successfully!")
print("File ID: ", response.id)