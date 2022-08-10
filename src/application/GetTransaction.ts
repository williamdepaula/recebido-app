import ITransactionRepository from "../domain/repository/TransactionRepository";

export default class GetTransaction {
  constructor(readonly transactionRepository: ITransactionRepository) {}

  async execute(id: string): Promise<Output> {
    return await this.transactionRepository.get(id);
  }
}

type Output = {
  id: string;
  title: string;
  amount: number;
  created_date: string;
  paid: boolean;
  date_paid?: string;
  description?: string;
};
