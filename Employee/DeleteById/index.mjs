import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({});

export const handler = async (event) => {
  
  const employeeId = event.pathParameters.employeeId;
  
  // console.log('event.pathParameters');
  // console.log(event.pathParameters);
  // console.log('employeeId');
  // console.log(employeeId);

  const params = {
    TableName: 'employee',
    Key: {
      employeeid: {
        "S": employeeId
      }
    }
  };
  
  // console.log('params');
  // console.log(params);

  try {
    const command = new DeleteItemCommand(params);

  const response = await client.send(command);
  // console.log(response);
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Employee deleted successfully!', employeeid: employeeId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Could not delete employee: ${error.message}` })
    };
  }
};