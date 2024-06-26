import { ComprehendClient, DetectPiiEntitiesCommand, DetectDominantLanguageCommand } from "@aws-sdk/client-comprehend";
const client = new ComprehendClient({ region: "us-east-1" });

export const handler = async (event, context) => {

    const ddlInput = { // DetectDominantLanguageRequest
        Text: event.queryStringParameters.text // required
      };

    const ddlCommand = new DetectDominantLanguageCommand(ddlInput);
    const ddlResponse = await client.send(ddlCommand);

    const dpeInput = { // DetectPiiEntities
      Text: event.queryStringParameters.text,
      LanguageCode: ddlResponse.Languages[0].LanguageCode
    };

    const dpeCommand = new DetectPiiEntitiesCommand(dpeInput);
    const dpeResponse = await client.send(dpeCommand);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            "Entities": dpeResponse.Entities
        })
    };

    return response;

};
