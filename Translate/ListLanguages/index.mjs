import { TranslateClient, ListLanguagesCommand } from "@aws-sdk/client-translate";
const client = new TranslateClient({ region: "us-east-1" });

export const handler = async (event) => {
  const input = {
    DisplayLanguageCode: "en"
  };
  const command = new ListLanguagesCommand(input);
  const llResponse = await client.send(command);
  
  console.log(llResponse);
    
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      "Languages": llResponse.Languages
    })
};

  return response;
}
