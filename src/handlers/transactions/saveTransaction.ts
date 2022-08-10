import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import SaveTransaction from "../../application/SaveTransaction";
import DynamoDBAdapter from "../../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../../infra/repository/TransactionDataBaseRepository";

const saveTransaction = middyfy(
  async (event): Promise<APIGatewayProxyResult> => {
    const connection = new DynamoDBAdapter();
    const transactionRepository = new TransactionDataBaseRepository(connection);
    const saveTransaction = new SaveTransaction(transactionRepository);
    const data = await saveTransaction.execute(event.body);
    return formatJSONResponse(data);
  }
);

export const main = saveTransaction;
