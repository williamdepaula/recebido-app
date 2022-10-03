import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

const health = middyfy(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({});
});

export const main = health;
