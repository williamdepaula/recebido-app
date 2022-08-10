import ITransactionRepository from "../domain/repository/TransactionRepository";

export default class DeleteTransaction {
  constructor(readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
