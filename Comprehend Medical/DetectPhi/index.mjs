// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/comprehendmedical/command/DetectPHICommand/

import { ComprehendMedicalClient, DetectPHICommand } from "@aws-sdk/client-comprehendmedical";
const client = new ComprehendMedicalClient({ region: "us-east-1" });

export const handler = async (event) => {
    const dpInput = { // DetectEntitiesV2Request
      Text: event.queryStringParameters.text
    };
    const dpCommand = new DetectPHICommand(dpInput);
    const dpResponse = await client.send(dpCommand);
    
    const response = {
      statusCode: 200,
      body: JSON.stringify({
          "Entities": dpResponse.Entities,
          "ModelVersion": dpResponse.ModelVersion
      })
    };

  return response;
}