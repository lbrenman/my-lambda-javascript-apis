import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
const client = new TranslateClient({ region: "us-east-1" });

export const handler = async (event) => {
  
  const input = {
    Text: event.queryStringParameters.text,
    SourceLanguageCode: event.queryStringParameters.sourcelanguage,
    TargetLanguageCode: event.queryStringParameters.targetlanguage,
    Settings: {
      Formality: "INFORMAL",
      Profanity: "MASK",
      Brevity: "ON",
    },
  };
  const command = new TranslateTextCommand(input);
  const ttResponse = await client.send(command);
  
  const response = {
      statusCode: 200,
      body: JSON.stringify({
        "AppliedSettings": {
            "Brevity": ttResponse.AppliedSettings.Brevity,
            "Formality": ttResponse.AppliedSettings.Brevity,
            "Profanity": ttResponse.AppliedSettings.Profanity
        },
        "SourceLanguageCode": ttResponse.SourceLanguageCode,
        "TargetLanguageCode": ttResponse.TargetLanguageCode,
        "TranslatedText": ttResponse.TranslatedText
      })
    };

  return response;
}
