import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
const client = new RekognitionClient({ region: "us-east-1" });

export const handler = async (event) => {
  
  const body = JSON.parse(event.body)
  
  const imageBytes = Buffer.from(body.image, "base64");
  
  const input = {
    Image: {
      Bytes: imageBytes
    },
  };
  
  const command = new DetectModerationLabelsCommand(input);
  const dmlResponse = await client.send(command);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
        "ModerationLabels": dmlResponse.ModerationLabels,
        "ModerationModelVersion": dmlResponse.ModerationModelVersion
    }),
  };
  
  return response;
  
};
