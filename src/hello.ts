import { formatJSONResponse } from "@libs/formatJSONResponse";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";

const hello = middyfy(async (): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse({
    message: "Hello World!!!",
  });
});

export const main = hello;
