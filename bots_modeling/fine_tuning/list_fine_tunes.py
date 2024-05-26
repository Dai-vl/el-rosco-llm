from dotenv import load_dotenv
import os
from openai import OpenAI

# Load .env file
load_dotenv()

# Get API_KEY
apiKey = os.getenv("API_KEY")

client = OpenAI(api_key=apiKey)

response = client.fine_tuning.jobs.list()

for job in response.data:
    print("\n")
    print("Job ID: ", job.id)
    print("Status: ", job.status)
    print("Created at: ", job.created_at)
    print("Model: ", job.fine_tuned_model)
    print("\n")
  