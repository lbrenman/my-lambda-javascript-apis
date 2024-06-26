import { ComprehendClient, DetectToxicContentCommand, DetectDominantLanguageCommand } from "@aws-sdk/client-comprehend";
const client = new ComprehendClient({ region: "us-east-1" });

export const handler = async (event, context) => {
  

  const ddlInput = { // DetectDominantLanguageRequest
      Text: event.queryStringParameters.text // required
    };

  const ddlCommand = new DetectDominantLanguageCommand(ddlInput);
  const ddlResponse = await client.send(ddlCommand);

  const dtcInput = {
    TextSegments: [ 
      {
        Text: event.queryStringParameters.text
      }
    ],
    LanguageCode: ddlResponse.Languages[0].LanguageCode
  };

  const dtcCommand = new DetectToxicContentCommand(dtcInput);
  const dtcResponse = await client.send(dtcCommand);

  const response = {
      statusCode: 200,
      body: JSON.stringify({
          "ResultList": dtcResponse.ResultList
      })
  };

  return response;

};
