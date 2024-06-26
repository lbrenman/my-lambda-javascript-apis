// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/comprehendmedical/command/DetectEntitiesV2Command/

import { ComprehendMedicalClient, DetectEntitiesV2Command } from "@aws-sdk/client-comprehendmedical";
const client = new ComprehendMedicalClient({ region: "us-east-1" });

export const handler = async (event) => {
    const deInput = { // DetectEntitiesV2Request
      Text: event.queryStringParameters.text
    };
    const deCommand = new DetectEntitiesV2Command(deInput);
    const deResponse = await client.send(deCommand);
    
    const response = {
      statusCode: 200,
      body: JSON.stringify({
          "Entities": deResponse.Entities,
          "ModelVersion": deResponse.ModelVersion
      })
    };

  return response;
}