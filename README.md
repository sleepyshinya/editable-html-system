# Editable HTML System

> 生成「可编辑系统」HTML 文档的 WorkBuddy Skill —— 不是静态页面，而是配置驱动、面板可编辑、版本可管理的文档系统。

## 这是什么

这是一个 [WorkBuddy](https://www.codebuddy.cn/) Skill。安装后，当你需要创建 HTML 文档时，它会生成一个**可编辑系统**而非一次性静态页面：

- 所有可编辑内容（标题、数字、说明、显隐、顺序、样式）集中在 `config.js` 配置层
- 右侧编辑面板支持实时修改文案、数字、样式权重、模块顺序、显隐切换
- 受保护内容（计算字段、跨模块联动、复杂表格）自动锁定，防止误改
- 修改后可另存为版本（v1/v2/v3），随时回滚，可导出为文件永久保存

## 生成文件结构

使用此 skill 生成文档时，会一次产出 4 个文件：

```
your-document/
├── index.html        # 页面壳：读取 config.js 渲染模块，承载编辑面板
├── config.js         # 配置层：所有可编辑内容的唯一数据源
├── data-source.md    # 数据来源说明：每个数字的出处与是否受保护
└── README.md         # 使用说明：如何编辑、版本管理、添加模块
```

## 核心特性

### 1. 配置驱动

所有内容集中在 `DOC_CONFIG` 对象中，包含 `meta`（元信息+设计风格）、`modules[]`（模块列表）、`settings`（面板行为）。

```javascript
const DOC_CONFIG = {
  meta: { title, version, style: { theme, primaryColor, ... } },
  modules: [
    { id, name, comment, type, visible, order, fields: { ... } }
  ]
}
```

### 2. 8 种模块类型

| 类型 | 用途 |
|---|---|
| `hero` | 首屏横幅（标题+副标题+CTA） |
| `metrics` | 核心指标卡片网格 |
| `text` | 文章段落（标题+正文） |
| `table` | 数据表格（支持合计行计算） |
| `chart` | 简易柱状图 |
| `callout` | 高亮提示框（info/warning/danger/success） |
| `timeline` | 时间线里程碑 |
| `list` | 功能/特性列表 |

### 3. 受保护内容标记

三类受保护内容自动锁定，面板只读：

| 类型 | 标记方式 | 示例 |
|---|---|---|
| 计算字段 | `compute: (f) => f.a.value + f.b.value` | 月活 = 日活 × 30 |
| 跨模块联动 | `linkTo: "moduleId.fieldName"` | 汇总页镜像指标页数据 |
| 复杂表格 | 模块级 `protected: true` | 含合计行和公式的业绩表 |

### 4. 版本管理

- 浏览器本地存储版本快照（v1 → v2 → v3）
- 一键加载历史版本回滚
- 导出 `config.vN.js` 文件永久保存（保留 compute 函数源码）

### 5. 明暗双主题

通过 `config.js → meta.style.theme` 切换 `"light"` / `"dark"`，或面板底部切换。

## 安装

### 方式一：下载 .skill 文件安装

1. 下载 [最新 Release](../../releases) 中的 `editable-html-system.skill` 文件
2. 在 WorkBuddy 中打开 Skill 管理页面
3. 导入 `.skill` 文件即可

### 方式二：手动安装

1. 克隆本仓库：
   ```bash
   git clone https://github.com/<your-username>/editable-html-system.git
   ```
2. 将 `editable-html-system` 目录复制到 WorkBuddy skills 目录：
   ```bash
   cp -r editable-html-system ~/.workbuddy/skills/
   ```
3. 重启 WorkBuddy，skill 自动加载

## 使用

安装后，在 WorkBuddy 对话中描述你要创建的文档即可触发，例如：

- 「帮我生成一个季度业务汇报的 HTML 文档」
- 「创建一个可编辑的产品介绍页面」
- 「做一个配置驱动的项目看板」

触发词包括：可编辑系统、配置驱动、生成html文档、编辑面板、版本管理、不要静态页面。

## Skill 结构

```
editable-html-system/
├── SKILL.md                          # 主指令：架构、配置、面板、受保护内容、版本管理
├── references/
│   ├── config-schema.md              # 完整配置字段 schema
│   ├── module-conventions.md         # 模块类型与受保护内容模式
│   └── design-style.md               # 设计令牌、明暗调色板、组件样式
└── assets/template/
    ├── index.html                    # 页面壳模板（渲染引擎+编辑面板+版本管理）
    ├── config.js                     # 配置层模板（含各模块类型示例）
    ├── README.md                     # 生成文档的使用说明模板
    └── data-source.md               # 数据来源说明模板
```

## 技术特点

- **纯 vanilla JS**，无框架依赖，无需构建工具
- 单文件 `index.html` + `config.js` 即可运行
- 版本快照智能序列化（数据序列化，compute 函数保留在原 config 中）
- 导出时用正则还原函数表达式，生成完整可用的 config.js
- 支持 `localStorage` 版本管理 + 文件导出双轨备份

## 设计哲学

> 高频修改项必须从配置层控制，不能硬编码在 HTML 中。

生成文档前会检查：
- [x] 所有标题、副标题、正文文案
- [x] 所有关键数字（含单位）
- [x] 模块显示/隐藏
- [x] 模块排列顺序
- [x] 标题字号、字重、颜色
- [x] 主题色与明暗模式
- [x] CTA 按钮文案与链接

## License

MIT
