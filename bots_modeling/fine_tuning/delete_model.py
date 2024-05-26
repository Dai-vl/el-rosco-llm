import argparse
from dotenv import load_dotenv
import os
from openai import OpenAI

# Create the parser
parser = argparse.ArgumentParser(description='Delete a fine-tuned model.')

# Add an argument
parser.add_argument('ModelID', type=str, help='The ID of the model to delete.')

# Parse the arguments
args = parser.parse_args()

# Load .env file
load_dotenv()

# Get API_KEY
apiKey = os.getenv("API_KEY")

client = OpenAI(api_key=apiKey)

fined_tuned_model = args.ModelID

try:
    response = client.models.delete(fined_tuned_model)
    print("Model deleted successfully!")
except (Exception) as error:
    print("Error:", error)
    print("Model:", fined_tuned_model)