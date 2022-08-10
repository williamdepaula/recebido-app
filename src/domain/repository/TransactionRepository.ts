import Transaction from "../models/Transaction";

export default interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  get(id: string): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
