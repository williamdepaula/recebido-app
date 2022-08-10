import DynamoDBAdapter from "../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../infra/repository/TransactionDataBaseRepository";
import SaveTransaction from "./SaveTransaction";

describe("Add Transaction", () => {
  it("Deve adicionar uma nova transação não paga", async () => {
    const input = {
      title: "Conta de Luz",
      amount: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
    };

    const connection = new DynamoDBAdapter();
    const transactionRepository = new TransactionDataBaseRepository(connection);
    const saveTransaction = new SaveTransaction(transactionRepository);
    const data = await saveTransaction.execute(input);
    expect(data.id).toBeDefined();
  });
});
