import { ComprehendClient, DetectDominantLanguageCommand } from "@aws-sdk/client-comprehend"; // ES Modules import
const client = new ComprehendClient({ region: "us-east-1" });

export const handler = async (event) => {

  const ddlInput = { // DetectDominantLanguageRequest
    Text: event.queryStringParameters.text // required
  };
  
  const ddlCommand = new DetectDominantLanguageCommand(ddlInput);
  const ddlResponse = await client.send(ddlCommand);
  
  const response = {
      statusCode: 200,
      body: JSON.stringify({
          "Languages": ddlResponse.Languages
      })
    };
  
  return response;

  
};