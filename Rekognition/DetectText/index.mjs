import { RekognitionClient, DetectTextCommand } from "@aws-sdk/client-rekognition";
const client = new RekognitionClient({ region: "us-east-1" });

export const handler = async (event) => {
  
  const body = JSON.parse(event.body)
  
  const imageBytes = Buffer.from(body.image, "base64");
  
  const input = {
    Image: {
      Bytes: imageBytes
    },
  };
  
  const command = new DetectTextCommand(input);
  const dtResponse = await client.send(command);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
        "TextDetections": dtResponse.TextDetections,
        "TextModelVersion": dtResponse.TextModelVersion
    }),
  };
  
  return response;
  
};
