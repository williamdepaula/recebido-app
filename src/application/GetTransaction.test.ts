import DynamoDBAdapter from "../infra/database/DynamoDBAdapter";
import TransactionDataBaseRepository from "../infra/repository/TransactionDataBaseRepository";
import GetTransaction from "./GetTransaction";
import SaveTransaction from "./SaveTransaction";

describe("Add Transaction", () => {
  it("Deve adicionar uma nova transação e checar se ela foi salva corretamente", async () => {
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
    const getTransaction = new GetTransaction(transactionRepository);
    const data = await getTransaction.execute(createdData.id);
    expect(createdData.id).toBeDefined();
    expect(createdData.title).toEqual(data.title);
    expect(createdData.amount).toEqual(data.amount);
    expect(createdData.created_date).toEqual(data.created_date);
    expect(createdData.paid).toEqual(data.paid);
  });
});
