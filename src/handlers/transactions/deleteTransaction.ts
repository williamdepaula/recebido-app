import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import DeleteTransaction from "../../application/DeleteTransaction";
import DynamoDBAdapter from "../../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../../infra/repository/TransactionDataBaseRepository";

const deleteTransaction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters;

    const connection = new DynamoDBAdapter();
    const transactionRepository = new TransactionDataBaseRepository(connection);
    const deleteTransaction = new DeleteTransaction(transactionRepository);
    await deleteTransaction.execute(id);

    return formatJSONResponse({});
  }
);

export const main = deleteTransaction;
