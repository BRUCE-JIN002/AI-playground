import "dotenv/config";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import documents from "./document.mjs";
import chalk from "chalk";

// 1. 初始化 ChatOpenAI 模型
// 用于与 OpenAI API 交互，生成文本回复
const model = new ChatOpenAI({
  temperature: 0,
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 2. 初始化 OpenAIEmbeddings 模型
// 用于将文本转换为向量表示，以便进行相似度计算
const embeddings = new OpenAIEmbeddings({
  modelName: process.env.EMBEDDINGS_MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 3. 初始化向量存储
// 将文档（documents）和嵌入模型（embeddings）传入 MemoryVectorStore.fromDocuments 方法
// 该方法会将文档转换为向量表示，并存储在内存中的向量存储中
const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings,
);

// 4. 创建检索器
// 使用已初始化的向量存储（vectorStore）生成一个检索器（retriever）
// 参数 k: 3 表示每次检索时返回与查询最相似的前 3 条文档
// 该检索器后续可用于 RAG（Retrieval-Augmented Generation）流程，为 LLM 提供上下文知识
const retriever = vectorStore.asRetriever({ k: 3 });

const questions = ["林萧是谁？", "苏雅是谁？他们是什么关系？"];

for (const question of questions) {
  console.log("=".repeat(80));
  console.log(chalk.green(`问题: ${question}`));
  console.log("=".repeat(80));

  // 使用 retriever 获取文档
  const retrievedDocs = await retriever.invoke(question);

  // 使用 similaritySearchWithScore 获取相似度评分
  const scoredResults = await vectorStore.similaritySearchWithScore(
    question,
    3,
  );

  // 打印用到的文档和相似度评分
  console.log(chalk.green("\n【检索到的文档及相似度评分】"));
  retrievedDocs.forEach((doc, i) => {
    // 找到对应的评分
    const scoredResult = scoredResults.find(
      ([scoredDoc]) => scoredDoc.pageContent === doc.pageContent,
    );
    const score = scoredResult ? scoredResult[1] : null;
    const similarity = score !== null ? (1 - score).toFixed(4) : "N/A";
    console.log(chalk.green(`\n[文档 ${i + 1}] 相似度: ${similarity}`));
    console.log(chalk.blue(`内容: ${doc.pageContent}`));
    console.log(
      chalk.yellow(
        `元数据: 章节=${doc.metadata.chapter}, 角色=${doc.metadata.character}, 类型=${doc.metadata.type}, 心情=${doc.metadata.mood}`,
      ),
    );
  });

  // 构建增强 prompt
  const context = retrievedDocs
    .map((doc, i) => `[片段${i + 1}]\n${doc.pageContent}`)
    .join("\n\n━━━━━\n\n");

  const prompt = `你是一个讲友情故事的老师。基于以下故事片段回答问题，用温暖生动的语言。如果故事中没有提到，就说"这个故事里还没有提到这个细节"。

故事片段:
${context}

问题: ${question}

老师的回答:`;

  console.log(chalk.green("\n【AI 回答】"));
  const response = await model.invoke(prompt);
  console.log(chalk.blue(response.content));
  console.log("\n");
}
