import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { randomUUID } = require('crypto');

import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});

export const handler = async (event) => {
  
  const requestBody = JSON.parse(event.body);
  const employeeName = requestBody.Name;
  const employeeEmail = requestBody.Email;
  const employeeTitle = requestBody.Title;
  const employeeId = randomUUID();
  
  
  const params = {
    TableName: 'employee',
    Item: {
      employeeid: {"S": employeeId},
      employeename:  {"S": employeeName},
      employeeemail:  {"S": employeeEmail},
      employeetitle:  {"S": `${employeeTitle}`}
    }
  };
  
  console.log('params');
  console.log(params);

  try {
    const command = new PutItemCommand(params);

  const response = await client.send(command);
  // console.log(response);
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Employee created successfully!', employeeid: employeeId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not create employee: ${error.message}` })
    };
  }
};