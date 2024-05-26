import argparse
from dotenv import load_dotenv
import os
from openai import OpenAI

# Create the parser
parser = argparse.ArgumentParser(description='Fine-tune a model with an uploaded file')

# Add an argument
parser.add_argument('File', type=str, help='The name of the file')
parser.add_argument('Suffix', type=str, help='The suffix for the fine-tuned model')

# Parse the arguments
args = parser.parse_args()

# Load .env file
load_dotenv()

# Get API_KEY
apiKey = os.getenv("API_KEY")

client = OpenAI(api_key=apiKey)

try: 
  job = client.fine_tuning.jobs.create(
    training_file= args.File,
    model="gpt-3.5-turbo",
    suffix=args.Suffix
  )
  print("Fine-tuning was successfull!")
except (Exception) as error:
  print("Error: ", error)
