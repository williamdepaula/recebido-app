import axios from "axios";

const url = process.env.URL;

const deleteItems = async (itens: { id }[]) => {
  itens.forEach(async (item) => {
    await axios.delete(`${url}/transactions/${item.id}`);
  });
};

describe("Add Transaction", () => {
  // TODO: Refatorar o código para uma arquitetura ports&adapters

  test("Deve adicionar uma nova transação não paga", async () => {
    const data = {
      title: "Conta de Luz",
      amount: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const res = await axios.post(`${url}/transactions`, data);
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
    await deleteItems([data]);
  });

  test("Deve adicionar uma nova transação e depois deletar ela", async () => {
    const data = {
      title: "Conta de Luz",
      amount: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const res = await axios.post(`${url}/transactions`, data);

    const resDelete = await axios.delete(`${url}/transactions/${res.data.id}`);
    expect(resDelete.status).toBe(200);
  });

  test("Deve adicionar uma nova transação e checar se ela foi salva corretamente", async () => {
    const data = {
      title: "Conta de Luz",
      amount: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const resAdd = await axios.post(`${url}/transactions`, data);
    const { id } = resAdd.data;

    const resGet = await axios.get(`${url}/transactions/${id}`);
    expect(id).toEqual(resGet.data.id);
    expect(resGet.data.title).toEqual(data.title);
    expect(resGet.data.amount).toEqual(data.amount);
    expect(resGet.data.created_date).toEqual(data.created_date);
    expect(resGet.data.paid).toEqual(data.paid);
    await deleteItems([data]);
  });

  // test("Deve retornar o total de transações", async () => {
  //   let data = {
  //     title: "Conta de Luz",
  //     cust: -334.5,
  //     created_date: `${Date.now()}`,
  //     paid: false,
  //     id: 1,
  //   };
  //   const luz = await axios.post(`${url}/transaction`, data);

  //   data = {
  //     title: "Conta de agua",
  //     cust: -227.5,
  //     created_date: `${Date.now()}`,
  //     paid: false,
  //     id: 1,
  //   };
  //   const agua = await axios.post(`${url}/transaction`, data);

  //   data = {
  //     title: "Salario",
  //     cust: 1200,
  //     created_date: `${Date.now()}`,
  //     paid: false,
  //     id: 1,
  //   };
  //   const salario = await axios.post(`${url}/transaction`, data);

  //   const resGet = await axios.get(`${url}/transaction/${id}`);

  // })
});
