import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});

import { ScanCommand,DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const params = {
    TableName: 'employee'
  };

  try {
    const command = new ScanCommand(params);

  const response = await ddbDocClient.send(command);
  // console.log(response);
  
    return {
      statusCode: 200,
      body: JSON.stringify(response.Items)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not retrieve employees: ${error.message}` })
    };
  }
};