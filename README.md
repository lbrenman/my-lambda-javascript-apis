My AWS Lambda API's

AWS Lambda and API Gateway - Created in JavaScript/NodeJS in Lambda and exposed via API Key in AWS API Gateway

* Comprehend - natural language processing (NLP) service that uses machine learning to analyze text and extract insights
    * Detect Dominant Language
    * Detect PII Entities
    * Detect Sentiment
    * Detect Toxic Content
* Medical Comprehend - natural language processing (NLP) service that uses machine learning to extract health data from medical text
    * Detect Entities
    * Detect PHI
* Rekognition - image analysis service that makes it easy to add advanced computer vision capabilities to your applications
    * Detect Labels
    * Detect Moderation Labels
    * Detect PPE
    * Detect Text
* Translate - text translation service that uses advanced machine learning technologies to provide high-quality translations
* Google Gemini - understand and generate text from a text prompt
    * Generate Text
* Finance - Stock Quote and Watchlist - Nodejs Lambda implementation of the API described [here](https://github.com/lbrenman/ai-stockquote-fh)
    * Quote
    * Watchlist
* Image Loader - An image API to upload an image and get a URL to use with other services. Leverages AWS S3 for storage.
    * Image - Get, Post, Delete (POST is the main API that would be exposed to consumers so they can upload a photo and get a signedUrl that lasts for 6 minutes)
    * ImageList - List all images
    * Bucket Cleaner - a scheduled lambda function that removes images older than 1 hour
* Amplify Platform Utils - A set of API's to perform operations on Axway Amplify Platform (Central/Marketplace
    * Get Environments
    * Get Product Subscriptions by Status