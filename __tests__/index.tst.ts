import axios from "axios";

const url = process.env.URL;

const deleteItems = async (itens: { id }[]) => {
  itens.forEach(async (item) => {
    await axios.delete(`${url}/transaction/${item.id}`);
  });
};

describe("Add Transaction", () => {
  test("Deve adicionar uma nova transação não paga", async () => {
    const data = {
      title: "Conta de Luz",
      cust: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const res = await axios.post(`${url}/transaction`, data);
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
    await deleteItems([data]);
  });

  test("Deve adicionar uma nova transação e depois deletar ela", async () => {
    const data = {
      title: "Conta de Luz",
      cust: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const res = await axios.post(`${url}/transaction`, data);

    const resDelete = await axios.delete(`${url}/transaction/${res.data.id}`);
    expect(resDelete.status).toBe(200);
  });

  test("Deve adicionar uma nova transação e checar se ela foi salva corretamente", async () => {
    const data = {
      title: "Conta de Luz",
      cust: 234.5,
      created_date: `${Date.now()}`,
      paid: false,
      id: 1,
    };
    const resAdd = await axios.post(`${url}/transaction`, data);
    const { id } = resAdd.data;

    const resGet = await axios.get(`${url}/transaction/${id}`);
    expect(id).toEqual(resGet.data.id);
    expect(resGet.data.title).toEqual(data.title);
    expect(resGet.data.cust).toEqual(data.cust);
    expect(resGet.data.created_date).toEqual(data.created_date);
    expect(resGet.data.paid).toEqual(data.paid);
    await deleteItems([data]);
  });
});
