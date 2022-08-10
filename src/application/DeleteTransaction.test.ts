import DynamoDBAdapter from "../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../infra/repository/TransactionDataBaseRepository";
import DeleteTransaction from "./DeleteTransaction";
import GetTransaction from "./GetTransaction";
import SaveTransaction from "./SaveTransaction";

describe("Add Transaction", () => {
  it("Deve adicionar uma nova transação e depois deletar ela", async () => {
    const input = {
      title: "Conta de Luz",
      amount: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
    };

    const connection = new DynamoDBAdapter();
    const transactionRepository = new TransactionDataBaseRepository(connection);
    const saveTransaction = new SaveTransaction(transactionRepository);
    const createdData = await saveTransaction.execute(input);

    const deleteTransaction = new DeleteTransaction(transactionRepository);
    await deleteTransaction.execute(createdData.id);

    const getTransaction = new GetTransaction(transactionRepository);
    const data = await getTransaction.execute(createdData.id);
    expect(data.id).toBeUndefined();
    expect(data.title).toBeUndefined;
    expect(data.amount).toBeUndefined();
    expect(data.created_date).toBeUndefined();
    expect(data.paid).toBeUndefined();
  });
});
