import axios from "axios";

const url = process.env.URL;

test("should ", async () => {
  console.log(`${url}/hello`);
  const res = await axios.get(`${url}/hello`);
  expect(res.status).toEqual(200);
  expect(res.data.message).toMatch("Hello World!");
});
