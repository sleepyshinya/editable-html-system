# <文档标题> — 使用说明

> 这是一个**可编辑系统**文档，不是静态页面。所有内容由 `config.js` 驱动，
> 右侧编辑面板可实时修改，修改后可另存为新版本（v1/v2/v3）随时回滚。

## 文件结构

```
<doc-name>/
├── index.html        # 页面壳：读取 config.js 渲染模块，承载编辑面板
├── config.js         # 配置层：所有可编辑内容的唯一数据源
├── data-source.md    # 数据来源说明：每个数字的出处与是否受保护
└── README.md         # 本文件：使用说明
```

## 两种编辑方式

### 方式一：编辑面板（适合所有人）

页面右侧有一个编辑面板（可点击右上角按钮收起/展开）。面板功能：

| 操作 | 说明 |
|---|---|
| 修改文案/数字 | 点击模块展开，直接在输入框修改，页面实时更新 |
| 修改标题样式 | 每个字段可调整字号、字重、颜色 |
| 显隐模块 | 每个模块有「显示」复选框，取消即隐藏该模块 |
| 调整顺序 | 每个模块有 ↑/↓ 按钮，可上下移动 |
| 保存版本 | 顶部「另存为新版本」按钮，自动递增 v1→v2→v3 |
| 加载历史版本 | 顶部版本下拉框，选择后回滚到该版本 |
| 导出配置 | 「导出」按钮，下载当前配置为 `config.vN.js` 文件 |

### 方式二：直接编辑 config.js（适合开发者）

打开 `config.js`，所有内容都在 `DOC_CONFIG` 对象中：

- `meta` — 文档元信息与设计风格（主题色、字体、宽度）
- `modules[]` — 模块列表，每个模块有 `id`、`name`、`comment`、`type`、`visible`、`order`、`fields`
- `fields{}` — 可编辑字段，每个字段有 `value`、`editable`、`style` 等属性

修改后刷新页面即可生效。

## 配置结构速览

```javascript
DOC_CONFIG = {
  meta: { title, version, style: { theme, primaryColor, ... } },
  modules: [
    {
      id: "hero",            // 唯一标识
      name: "顶部横幅",       // 模块名（面板显示）
      comment: "首屏主视觉",   // 注释标签
      type: "hero",           // 类型: hero|metrics|text|table|callout|timeline|list|chart
      visible: true,          // 显隐
      order: 1,               // 排序
      fields: {
        title: { value: "标题", editable: true, style: { fontSize: 36 } }
      }
    }
  ]
}
```

## 受保护内容

部分内容不可在编辑面板直接修改，因为它们有计算关联或结构依赖：

| 类型 | 标记方式 | 面板表现 |
|---|---|---|
| 计算字段 | `protected: true` + `compute: (f) => ...` | 显示锁图标 + 计算原因，只读 |
| 跨模块联动 | `protected: true` + `linkTo: "模块.字段"` | 显示锁图标 + 来源说明，只读 |
| 复杂表格 | 模块级 `protected: true` + `protectedReason` | 整个模块只读 + 提示 |

受保护字段的值会随源字段变化自动更新。如需修改受保护内容，请编辑 `config.js`。

详见 `data-source.md` 了解每个数字的来源。

## 版本管理

- **保存**：点击「另存为新版本」，当前配置快照存入浏览器 localStorage
- **加载**：从版本下拉框选择，即时回滚（不覆盖 config.js 文件）
- **导出**：点击「导出」，下载 `config.vN.js`，可替换原 config.js 永久保存

> 注意：版本存储在浏览器本地。清除浏览器数据会丢失版本记录。
> 重要修改请务必「导出」为文件保存。

## 添加新模块

在 `config.js` 的 `modules` 数组中添加：

```javascript
{
  id: "new-section",          // 唯一 kebab-case
  name: "新区块",
  comment: "新模块说明",
  type: "text",                // 选择合适的类型
  visible: true,
  order: 8,                    // 排序位置
  fields: {
    heading: { value: "标题", editable: true, style: { fontSize: 22, fontWeight: 600 } },
    body: { value: "内容...", editable: true, multiline: true }
  }
}
```

支持的模块类型：`hero`、`metrics`、`text`、`table`、`callout`、`timeline`、`list`、`chart`

## 切换主题

在 `config.js → meta.style` 中修改：

```javascript
style: { theme: "dark" }   // "light" 或 "dark"
```

或在编辑面板的「文档设置」中切换。

## 高频修改项速查

以下内容均可通过编辑面板或 config.js 控制：

- [x] 所有标题、副标题、正文文案
- [x] 所有关键数字（含单位）
- [x] 模块显示/隐藏
- [x] 模块排列顺序
- [x] 标题字号、字重、颜色
- [x] 主题色与明暗模式
- [x] CTA 按钮文案与链接
