import Transaction from "../domain/models/Transaction";
import ITransactionRepository from "../domain/repository/TransactionRepository";
const { v4: uuidv4 } = require("uuid");

export default class SaveTransaction {
  constructor(readonly transactionRepository: ITransactionRepository) {}

  async execute(input: Input): Promise<any> {
    const transaction = new Transaction(
      input.title,
      input.amount,
      `${input.created_date}`,
      input.paid
    );
    transaction.id = uuidv4();

    return await this.transactionRepository.save(transaction);
  }
}

type Input = {
  title: string;
  amount: number;
  created_date: string;
  paid: boolean;
};
