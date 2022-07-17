const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");

import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import Transaction from "src/domain/models/Transaction";

const saveTransaction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const { body } = event;
    const transaction = new Transaction(
      body.title,
      body.cust,
      `${body.created_date}`,
      body.paid
    );
    transaction.id = uuidv4();

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
          S: `${transaction.id}`,
        },
      },
      UpdateExpression:
        "set title = :title, cust = :cust, created_date = :created_date, paid = :paid ",
      ExpressionAttributeValues: {
        ":title": { S: transaction.title },
        ":cust": { N: `${transaction.cust}` },
        ":created_date": { S: transaction.created_date },
        ":paid": { BOOL: transaction.paid },
      },
      ReturnValues: "ALL_NEW",
      TableName,
    };

    const dataDB = await connection.updateItem(paramsDB).promise();
    const data = DynamoDB.Converter.unmarshall(dataDB["Attributes"]);

    return formatJSONResponse(data);
  }
);

export const main = saveTransaction;
