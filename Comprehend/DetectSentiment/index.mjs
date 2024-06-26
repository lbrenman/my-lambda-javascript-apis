import { ComprehendClient, DetectSentimentCommand, DetectDominantLanguageCommand } from "@aws-sdk/client-comprehend";
const client = new ComprehendClient({ region: "us-east-1" });

export const handler = async (event, context) => {
    
    const ddlInput = { // DetectDominantLanguageRequest
        Text: event.queryStringParameters.text // required
      };
      
    const ddlCommand = new DetectDominantLanguageCommand(ddlInput);
    const ddlResponse = await client.send(ddlCommand);
    
    const dsInput = { // DetectSentimentRequest
      Text: event.queryStringParameters.text,
      LanguageCode: ddlResponse.Languages[0].LanguageCode
    };
    
    const dsCommand = new DetectSentimentCommand(dsInput);
    const dsResponse = await client.send(dsCommand);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            "Sentiment": dsResponse.Sentiment,
            "SentimentScore": {
                "Mixed": dsResponse.SentimentScore.Mixed,
                "Negative": dsResponse.SentimentScore.Negative,
                "Neutral": dsResponse.SentimentScore.Neutral,
                "Positive": dsResponse.SentimentScore.Positive
            }
        })
    };

    return response;

};
