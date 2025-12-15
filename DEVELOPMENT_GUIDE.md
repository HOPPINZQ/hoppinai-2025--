# 2025 Time Track - 项目开发改造指南

这份指南基于对现有代码库的分析，旨在指导将 `2025-time-track` 项目从原型/演示状态改造为高质量、可维护、生产就绪的 React 应用。

## 1. 项目现状诊断

### 现有架构
- **核心框架**: React 19 + Vite + TypeScript
- **样式方案**: Tailwind CSS (目前通过 CDN 引入) + App.tsx 内联样式
- **动画库**: GSAP (目前通过 CDN 引入)
- **AI 集成**: Google Gemini API (`@google/genai`)
- **数据源**: `data.ts` 中的静态 Mock 数据

### 主要问题
1.  **依赖管理混乱**:
    - `index.html` 中混合使用了 Import Maps 和 CDN (`tailwindcss`, `gsap`)，这与 `package.json` 中的本地依赖管理冲突，且不利于生产环境构建。
    - Tailwind CSS 通过 CDN 引入会导致页面加载时样式闪烁 (FOUC)，且无法使用 Tailwind 的高级配置和构建优化（如 PurgeCSS）。
2.  **代码规范**:
    - `App.tsx` 中包含大量内联 `<style>` 标签，难以维护。
    - 缺少全局 CSS 文件 (`index.css` 在 HTML 中被引用但文件不存在)。
3.  **环境配置**:
    - `vite.config.ts` 中手动 polyfill 了 `process.env`，这在 Vite 项目中不是最佳实践（应使用 `import.meta.env`）。
4.  **组件结构**:
    - 组件划分尚可，但部分组件可能包含了过多的业务逻辑或样式细节，需要进一步解耦。

---

## 2. 改造路线图

### 第一阶段：基础设施与依赖治理 (Foundation)
**目标**: 移除 CDN 依赖，建立标准的 Vite + NPM 构建流程。

1.  **清理 HTML**:
    - 移除 `index.html` 中的 `<script src="https://cdn.tailwindcss.com"></script>`。
    - 移除 `index.html` 中的 Import Maps 和 GSAP CDN 链接。
2.  **安装本地依赖**:
    - 确保 `tailwindcss`, `postcss`, `autoprefixer` 已安装。
    - 确保 `gsap` 已安装。
3.  **配置 Tailwind**:
    - 初始化 `tailwind.config.js` 和 `postcss.config.js`。
    - 创建 `src/index.css` 并引入 Tailwind 指令。
    - 在 `index.tsx` 中引入 `index.css`。

### 第二阶段：样式与代码重构 (Refactoring)
**目标**: 统一管理样式，提升代码可维护性。

1.  **移除内联样式**:
    - 将 `App.tsx` 中的 `<style>` 块迁移至 `index.css` 或转换为 Tailwind Utility Classes。
    - 自定义动画（如 `blob`）应配置在 `tailwind.config.js` 的 `theme.extend` 中。
2.  **环境变量标准化**:
    - 修改 `services/geminiService.ts`，使用 `import.meta.env.VITE_GEMINI_API_KEY` 替代 `process.env`。
    - 更新 `vite.config.ts`，移除不必要的 `define` polyfill（除非特定库强制要求）。

### 第三阶段：功能增强与 AI 优化 (Enhancement)
**目标**: 增强 AI 功能的稳定性和交互体验。

1.  **AI 服务优化**:
    - 完善 `services/geminiService.ts` 中的错误处理。
    - 考虑添加流式响应 (Streaming) 支持，提升用户体验。
2.  **数据结构**:
    - 将 `data.ts` 的类型定义剥离到 `types.ts`（如果尚未完成）。
    - 考虑从外部 API 或 CMS 获取数据，使应用动态化。

### 第四阶段：性能与部署 (Optimization)
**目标**: 优化加载速度和视觉体验。

1.  **资源优化**:
    - 检查图片资源，使用 WebP 格式或图片 CDN。
    - 对大型组件（如 `PhotoWallSection`, `GamingSection`）实施懒加载 (Lazy Loading)。
2.  **构建部署**:
    - 配置 `vite.config.ts` 的 build 选项。
    - 确保 `package.json` 中的 build 脚本正常工作。

---

## 3. 具体执行步骤参考

### 3.1 初始化 Tailwind CSS (本地化)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js 配置示例**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // 如果 components 在 src 外
    "./**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        blob: "blob 10s infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
```

### 3.2 创建 CSS 入口

创建 `src/index.css` (如果项目结构是 src 目录):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Global Styles */
body {
  @apply bg-black text-white overflow-x-hidden font-sans;
}
```

### 3.3 修正 Gemini 服务

修改 `services/geminiService.ts`:

```typescript
// 推荐使用标准的 Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// 使用 Vite 环境变量
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateYearlySummary = async (): Promise<string> => {
  if (!API_KEY) {
    console.warn("Missing VITE_GEMINI_API_KEY");
    return "API Key missing...";
  }
  // ... 剩余逻辑
};
```

---

此指南提供了一个清晰的重构路径。建议优先执行 **第一阶段**，解决依赖和构建问题，确保本地开发环境的稳定性。
