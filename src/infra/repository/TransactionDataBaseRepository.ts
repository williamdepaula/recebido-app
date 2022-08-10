import Transaction from "../../domain/models/Transaction";
import ITransactionRepository from "../../domain/repository/TransactionRepository";
import IConnection from "../database/IConnection";

export default class TransactionDataBaseRepository
  implements ITransactionRepository
{
  dbOptions: object;
  constructor(readonly connection: IConnection) {}
  async save(transaction: Transaction): Promise<Transaction> {
    return await this.connection.saveItem(transaction);
  }
  async get(id: string): Promise<Transaction> {
    return await this.connection.getItem(id);
  }
  async delete(id: string): Promise<void> {
    await this.connection.deleteItem(id);
  }
}
