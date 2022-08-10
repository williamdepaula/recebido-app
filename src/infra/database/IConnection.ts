export default interface IConnection {
  saveItem(params: any): Promise<any>;
  getItem(params: any): Promise<any>;
  deleteItem(params: any): Promise<any>;
  close(): Promise<void>;
}
