import { Document } from "@langchain/core/documents";

export default [
  new Document({
    pageContent: "你好，我叫林萧，是一名喜爱文学的男青年，性格沉稳内敛。",
    metadata: {
      chapter: 1,
      character: "林萧",
      type: "角色介绍",
      mood: "沉稳",
    },
  }),
  new Document({
    pageContent: "你好，我是苏雅，一名热爱艺术的女青年，性格温柔开朗。",
    metadata: {
      chapter: 1,
      character: "苏雅",
      type: "角色介绍",
      mood: "温柔",
    },
  }),
  // 爱情故事：图书馆偶遇
  new Document({
    pageContent:
      "午后的阳光透过图书馆的落地窗洒在书架上，林萧手里拿着一本《百年孤独》，目光却不由自主地被角落里的那个身影吸引。她叫苏雅，穿着白色的连衣裙，正踮着脚尖试图够取架子上层的一本画册。",
    metadata: {
      chapter: 1,
      character: "林萧",
      type: "剧情",
      location: "图书馆",
      mood: "心动",
    },
  }),
  new Document({
    pageContent:
      "“需要帮忙吗？”林萧走上前，轻松地取下那本画册递给她。苏雅转过身，微风吹起她的发丝，她露出了一个明媚的笑容：“谢谢你，这本书我找了好久。”那一刻，林萧听到了自己心跳的声音。",
    metadata: {
      chapter: 1,
      character: "苏雅",
      type: "对话",
      location: "图书馆",
      mood: "感激",
    },
  }),
  // 爱情故事：咖啡店重逢
  new Document({
    pageContent:
      "一周后的雨天，林萧匆匆跑进街角的咖啡店，收起雨伞时，意外地发现苏雅正坐在窗边。她面前放着那本画册，还有两杯热拿铁。“好巧，”苏雅抬起头，眼睛弯成了月牙，“我好像预感你会来，多点了一杯。”",
    metadata: {
      chapter: 2,
      character: "苏雅",
      type: "剧情",
      location: "咖啡店",
      mood: "惊喜",
    },
  }),
  // 爱情故事：表白
  new Document({
    pageContent:
      "咖啡的香气在空气中弥漫，林萧看着苏雅认真的侧脸，终于鼓起勇气：“苏雅，其实从图书馆那天起，我就……”苏雅放下手中的笔，静静地看着他，眼中闪烁着温柔的光芒：“我知道，我也是。”",
    metadata: {
      chapter: 3,
      character: "林萧",
      type: "对话",
      location: "咖啡店",
      mood: "甜蜜",
    },
  }),
];
