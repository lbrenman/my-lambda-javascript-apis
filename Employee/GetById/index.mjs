import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  
  const employeeId = event.pathParameters.employeeId;
  
  const params = {
    TableName: 'employee',
    Key: {
      employeeid: employeeId
    }
  };

  try {
    const command = new GetCommand(params);
    const response = await docClient.send(command);
    
    if(response.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(response.Item)
      };  
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `No employee found with employeeid: ${employeeId}` })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not retrieve employee: ${error.message}` })
    };
  }
};