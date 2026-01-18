import { spawn } from "child_process";

const command =
  'echo -e "n\nn" | pnpm create vite react-todo-app --template react-ts';
const cwd = process.cwd();

// 解析命令行参数
const [cmd, ...args] = command.split(" ");

const child = spawn(cmd, args, {
  cwd,
  stdio: "inherit", // 实时输出到控制台
  shell: true, // 启用 shell 功能
});

const errorMsg = null;

child.on("error", (err) => {
  errorMsg = err.message;
});

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`命令执行失败，退出码 ${code}`);
    console.error(errorMsg);
  }
});

child.on("close", (code) => {
  if (code === 0) {
    process.exit(0);
  } else {
    if (errorMsg) {
      console.error(`错误: ${errorMsg}`);
    }
    process.exit(code || 1);
  }
});
