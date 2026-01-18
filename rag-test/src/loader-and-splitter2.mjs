import "dotenv/config";
import "cheerio";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import chalk from "chalk";

// 初始化 OpenAI 模型
const model = new ChatOpenAI({
  temperature: 0,
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 初始化 OpenAI 嵌入模型
const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.EMBEDDINGS_MODEL_NAME,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

//  初始化文档加载器
const cheerioLoader = new CheerioWebBaseLoader(
  "https://juejin.cn/post/7233327509919547452",
  {
    selector: ".main-area p",
  },
);

// 加载文档内容
const documents = await cheerioLoader.load();

console.assert(documents.length === 1);
console.log(`Total characters: ${documents[0].pageContent.length}`);

// 初始化文本分块器
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500, // 每个分块的字符数
  chunkOverlap: 50, // 分块之间的重叠字符数
  separators: ["。", "！", "？"], // 分割符，优先使用段落分隔
});

// 分割文档
const splitDocuments = await textSplitter.splitDocuments(documents);

console.log(splitDocuments);

console.log(`文档分割完成，共 ${splitDocuments.length} 个分块\n`);

console.log("正在创建向量存储...");
// 创建向量存储
const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocuments,
  embeddings,
);
console.log("向量存储创建完成\n");

const questions = ["父亲的去世对作者的人生态度产生了怎样的根本性逆转？"];

// RAG 流程：对每个问题进行检索和回答
for (const question of questions) {
  console.log("=".repeat(80));
  console.log(`问题: ${question}`);
  console.log("=".repeat(80));

  // 使用 similaritySearchWithScore 获取文档和相似度评分（一次调用即可）
  const scoredResults = await vectorStore.similaritySearchWithScore(
    question,
    2,
  );

  // 从 scoredResults 中提取文档和评分
  const retrievedDocs = scoredResults.map(([doc]) => doc);

  // 打印检索到的文档和相似度评分
  console.log("\n【检索到的文档及相似度评分】");
  scoredResults.forEach(([doc, score], i) => {
    const similarity = (1 - score).toFixed(4);

    console.log(chalk.yellow(`\n[文档 ${i + 1}] 相似度: ${similarity}`));
    console.log(chalk.green(`内容: ${doc.pageContent}`));
    if (doc.metadata && Object.keys(doc.metadata).length > 0) {
      console.log(chalk.blue(`元数据:`, doc.metadata));
    }
  });

  // 构建 prompt
  const context = retrievedDocs
    .map((doc, i) => `[片段${i + 1}]\n${doc.pageContent}`)
    .join("\n\n━━━━━\n\n");

  const prompt = `你是一个文章辅助阅读助手，根据文章内容来解答：

文章内容：
${context}

问题: ${question}

你的回答:`;

  console.log(chalk.cyan("\n【AI 回答】"));
  const response = await model.invoke(prompt);
  console.log(response.content);
  console.log("\n");
}
