const DynamoDB = require("aws-sdk/clients/dynamodb");

import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

const deleteTransaction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;

    let dbOptions = {};
    if (process.env.IS_OFFLINE) {
      dbOptions = {
        apiVersion: "2012-08-10",
        region: "localhost",
        endpoint: "http://localhost:8000",
      };
    } else {
      dbOptions = {
        apiVersion: "2012-08-10",
        region: process.env.REGION,
      };
    }

    const connection = new DynamoDB(dbOptions);
    const TableName = process.env.TRANSACTIONS_TABLE;

    let paramsDB = {
      Key: {
        id: {
          S: `${id}`,
        },
      },

      TableName,
    };

    const dataDB = await connection.deleteItem(paramsDB).promise();
    const data = DynamoDB.Converter.unmarshall(dataDB["Attributes"]);

    return formatJSONResponse(data);
  }
);

export const main = deleteTransaction;
