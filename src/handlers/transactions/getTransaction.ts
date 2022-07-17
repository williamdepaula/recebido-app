const DynamoDB = require("aws-sdk/clients/dynamodb");

import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

const getTransaction = middyfy(
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

    var params = {
      Key: {
        id: {
          S: `${id}`,
        },
      },
      TableName,
    };

    let dataDB = await connection.getItem(params).promise();
    let data = DynamoDB.Converter.unmarshall(dataDB["Item"]);

    return formatJSONResponse(data);
  }
);

export const main = getTransaction;
