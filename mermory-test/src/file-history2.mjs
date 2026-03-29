import { ChatOpenAI } from "@langchain/openai";
import { FileSystemChatMessageHistory } from "@langchain/community/stores/message/file_system";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 显式指定 .env 文件路径（位于项目根目录）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

async function fileHistoryDemo() {
  // 指定存储文件的路径
  const filePath = path.join(process.cwd(), "chat_history.json");
  const sessionId = "user_session_001"; // 系统提示词

  //系统提示词
  const systemMessage = new SystemMessage(
    "你是一个友好的做菜助手，喜欢分享美食和烹饪技巧。",
  );

  console.log("[第一轮对话]");

  const restoredHistory = new FileSystemChatMessageHistory({
    filePath: filePath,
    sessionId: sessionId,
  });

  const restoredMessages = await restoredHistory.getMessages();
  console.log(`从文件恢复了 ${restoredMessages.length} 条历史消息：`);
  restoredMessages.forEach((msg, index) => {
    const type = msg.type;
    const prefix = type === "human" ? "用户" : "助手";
    console.log(
      `  ${index + 1}. [${prefix}]: ${msg.content.substring(0, 50)}...`,
    );
  });
  console.log("----------------");

  console.log("[第三轮对话]");
  console.log("think.......");

  const userMessage3 = new HumanMessage("需要哪些食材？");
  await restoredHistory.addMessage(userMessage3);
  const messages3 = [systemMessage, ...(await restoredHistory.getMessages())];
  const response3 = await model.invoke(messages3);
  await restoredHistory.addMessage(response3);
  console.log(`用户: ${userMessage3.content}`);
  console.log(`助手: ${response3.content}`);
  console.log(`✓ 对话已保存到文件\n`);
}

fileHistoryDemo().catch(console.error);
