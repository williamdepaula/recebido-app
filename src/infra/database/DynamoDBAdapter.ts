import IConnection from "./IConnection";
const DynamoDB = require("aws-sdk/clients/dynamodb");

const TABLENAME = process.env.TRANSACTIONS_TABLE || "transactionsTable";
const IS_OFFLINE = process.env.IS_OFFLINE || true;

export default class DynamoDBAdapter implements IConnection {
  dbOptions: object;
  connection: any;

  constructor() {
    this.dbOptions = {};
    if (IS_OFFLINE) {
      this.dbOptions = {
        apiVersion: "2012-08-10",
        region: "localhost",
        endpoint: "http://localhost:8000",
      };
    } else {
      this.dbOptions = {
        apiVersion: "2012-08-10",
        region: process.env.REGION,
      };
    }

    this.connection = new DynamoDB(this.dbOptions);
  }

  async saveItem(params: any): Promise<any> {
    let paramsDB = {
      Key: {
        id: {
          S: `${params.id}`,
        },
      },
      UpdateExpression:
        "set title = :title, amount = :amount, created_date = :created_date, paid = :paid ",
      ExpressionAttributeValues: {
        ":title": { S: params.title },
        ":amount": { N: `${params.amount}` },
        ":created_date": { S: params.created_date },
        ":paid": { BOOL: params.paid },
      },
      ReturnValues: "ALL_NEW",
      TableName: TABLENAME,
    };

    const dataDB = await this.connection.updateItem(paramsDB).promise();
    return DynamoDB.Converter.unmarshall(dataDB["Attributes"]);
  }
  async getItem(params: any): Promise<any> {
    var paramsDB = {
      Key: {
        id: {
          S: `${params}`,
        },
      },
      TableName: TABLENAME,
    };
    const dataDB = await this.connection.getItem(paramsDB).promise();
    return DynamoDB.Converter.unmarshall(dataDB["Item"]);
  }
  async deleteItem(params: any): Promise<void> {
    let paramsDB = {
      Key: {
        id: {
          S: `${params}`,
        },
      },

      TableName: TABLENAME,
    };
    await this.connection.deleteItem(paramsDB).promise();
  }
  close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
