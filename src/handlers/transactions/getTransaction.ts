import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import GetTransaction from "../../application/GetTransaction";
import DynamoDBAdapter from "../../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../../infra/repository/TransactionDataBaseRepository";

const getTransaction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;

    const connection = new DynamoDBAdapter();
    const transactionRepository = new TransactionDataBaseRepository(connection);
    const getTransaction = new GetTransaction(transactionRepository);
    const data = await getTransaction.execute(id);

    return formatJSONResponse(data);
  }
);

export const main = getTransaction;
