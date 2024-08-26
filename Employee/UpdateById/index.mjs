import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  
  const employeeId = event.pathParameters.employeeId;
  const requestBody = JSON.parse(event.body);
  
  let params = {};
  var command;
  var response;
  
  try {
    
    if(requestBody.hasOwnProperty('employeeemail')) {
      params = {
        TableName: 'employee',
        Key: { employeeid: employeeId },
        UpdateExpression: "SET employeeemail = :employeeemail",
        ExpressionAttributeValues: {
          ":employeeemail": requestBody.employeeemail
        },
        ReturnValues: "ALL_NEW"
      };
          
      command = new UpdateCommand(params);
      response = await docClient.send(command);
    }
    
    if(requestBody.hasOwnProperty('employeename')) {
      params = {
        TableName: 'employee',
        Key: { employeeid: employeeId },
        UpdateExpression: "SET employeename = :employeename",
        ExpressionAttributeValues: {
          ":employeename": requestBody.employeename
        },
        ReturnValues: "ALL_NEW"
      };
      
      command = new UpdateCommand(params);
      response = await docClient.send(command);
    }
    
    if(requestBody.hasOwnProperty('employeetitle')) {
      params = {
        TableName: 'employee',
        Key: { employeeid: employeeId },
        UpdateExpression: "SET employeetitle = :employeetitle",
        ExpressionAttributeValues: {
          ":employeetitle": requestBody.employeetitle
        },
        ReturnValues: "ALL_NEW"
      };
      
      command = new UpdateCommand(params);
      response = await docClient.send(command);
    }
    
    if(response['$metadata'].httpStatusCode == 200) {
      return {
        statusCode: 200,
        body: JSON.stringify(response.Attributes)
      };  
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Could not update employee` })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not update employee: ${error.message}` })
    };
  }
};