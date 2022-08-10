export default class Transaction {
  public id: string;
  constructor(
    public title: string,
    public amount: number,
    public created_date: string,
    public paid: boolean,
    public date_paid?: string,
    public description?: string
  ) {}
}
