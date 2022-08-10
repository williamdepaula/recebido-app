import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "recebido-app",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dynamodb-local",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    region: "us-east-1",
    profile: "recebido-app",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      REGION: "${self:provider.region}",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TRANSACTIONS_TABLE: "${self:custom.transactionsTable}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
              "dynamodb:UpdateItem",
            ],
            Resource: [{ "Fn::GetAtt": ["transactionsTable", "Arn"] }],
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      transactionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          TableName: "${self:custom.transactionsTable}",
        },
      },
    },
  },
  functions: {
    hello: {
      handler: "src/hello.main",
      events: [
        {
          http: {
            method: "get",
            path: "hello",
          },
        },
      ],
    },

    SaveTransaction: {
      handler: "src/handlers/transactions/saveTransaction.main",
      events: [
        {
          http: {
            method: "post",
            path: "transactions",
          },
        },
      ],
    },

    GetTransaction: {
      handler: "src/handlers/transactions/getTransaction.main",
      events: [
        {
          http: {
            method: "get",
            path: "transactions/{id}",
          },
        },
      ],
    },

    deleteTransaction: {
      handler: "src/handlers/transactions/deleteTransaction.main",
      events: [
        {
          http: {
            method: "delete",
            path: "transactions/{id}",
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    transactionsTable: "transactionsTable",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: "dev",
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        convertEmptyValues: true,
      },
    },
  },
};

module.exports = serverlessConfiguration;
