import "dotenv/config";
import { RunnablePick, RunnableSequence } from "@langchain/core/runnables";

const inputData = {
  name: "jing",
  age: 25,
  city: "上海",
  country: "中国",
  email: "jing@example.com",
  phone: "+86-1380898000",
};

const chain = RunnableSequence.from([
  (input) => ({
    ...input,
    fullInfo: `${input.name}，${input.age}岁，来自${input.city}`,
  }),
  new RunnablePick(["name", "fullInfo"]),
]);

const result = await chain.invoke(inputData);
console.log(result);
