# 栖心 Flow · 同频社区

中文正念冥想单页应用。包含 **今日、冥想、同频社区、心语、我的** 五个入口：

- 14 段原创练习与独立背景、滑动心语卡片
- 同频社区：笔记、话题筛选、关注、点赞、收藏、评论、发布、照片选择、练习打卡（本机演示数据，无真实多用户后台）
- 可选的真实 AI 冥想引导词生成（服务端接口，支持 DeepSeek / 通义千问）

## 目录结构

- `index.html`：自包含单文件静态版（GitHub Pages 直接托管，图片已内嵌）
- `src/`：五个页面与社区的全部源码
- `worker/handler.js`：AI 生成接口（Cloudflare Worker）
- `dist/server/index.js`：构建后的 Worker 产物（含 PAGE / APP / 接口）
- `scripts/build.mjs`：构建单文件与 Worker；`scripts/preview.mjs`：本地服务
- `wrangler.jsonc`：Cloudflare 部署模板
- `package.json`：构建 / 本地启动脚本

## 静态托管（GitHub Pages）

仓库根目录的 `index.html` 是自包含单文件，直接作为 Pages 站点。
冥想、同频社区、心语、打卡、本地规则自定义均可用；**真实 AI 生成**因没有后端与密钥会显示“未连接”，由本地引导兜底。

## 开启真实 AI（Cloudflare Workers，免费）

1. 安装 Node.js，在本目录执行 `node scripts/build.mjs`，生成 `dist/index.html` 与 `dist/server/index.js`。
2. 配置密钥（不要写进代码）：
   - `npx wrangler login` 登录你的 Cloudflare 账号；
   - `npx wrangler secret put AI_API_KEY` 填入 DeepSeek 或通义千问的密钥；
   - 服务商见 `wrangler.jsonc` 的 `AI_PROVIDER`（`deepseek` 或 `qwen`）。
3. `npx wrangler deploy` 部署，得到 Worker 网址。
4. 本地预览：`node scripts/preview.mjs`，访问 http://127.0.0.1:8766

## 功能边界

社区作者、笔记与互动数字均为演示示例；新增笔记、照片与互动仅保存在本机浏览器，不发送给其他用户。没有真实多用户后台、账号云同步或支付。AI 生成内容由第三方模型提供，需自行准备密钥并承担用量与合规责任。
