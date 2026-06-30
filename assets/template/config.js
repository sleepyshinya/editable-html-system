// ============================================================
// config.js — 配置层（单一数据源）
// ============================================================
// 所有可编辑文案、数字、标题、显隐状态、样式权重集中于此。
// 页面（index.html）读取本对象渲染，编辑面板读写本对象。
// 受保护字段（计算关联、联动逻辑、复杂表格）单独标记，不可面板直接编辑。
// 修改后可通过编辑面板「另存为新版本」（v1/v2/v3），随时回滚。
// ============================================================

const DOC_CONFIG = {

  // ============================================================
  // 元信息 + 设计风格
  // ============================================================
  meta: {
    docId: "quarterly-report-demo",   // 唯一ID，用作版本存储键
    version: "v1",                      // 当前版本
    title: "2026 Q2 业务汇报",
    description: "季度核心指标与进展回顾",
    createdAt: "2026-06-30",
    updatedAt: "2026-06-30",
    style: {
      theme: "light",                  // "light" | "dark"
      primaryColor: "#1890ff",
      accentColor: "#722ed1",
      successColor: "#52c41a",
      warningColor: "#faad14",
      dangerColor: "#ff4d4f",
      fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      maxWidth: 960,
      radius: 12
    }
  },

  // ============================================================
  // 模块列表
  // ============================================================
  modules: [

    // ---- [模块] 顶部横幅 ---- 首屏主视觉 ----
    {
      id: "hero",
      name: "顶部横幅",
      comment: "首屏主视觉区域",
      type: "hero",
      visible: true,
      order: 1,
      fields: {
        title: {
          value: "2026 第二季度业务汇报",
          editable: true,
          label: "主标题",
          style: { fontSize: 36, fontWeight: 700 }
        },
        subtitle: {
          value: "核心指标增长显著，Q3 持续发力",
          editable: true,
          label: "副标题",
          style: { fontSize: 18, color: "var(--color-text-sub)" }
        },
        ctaText: {
          value: "查看详细数据",
          editable: true,
          label: "按钮文案"
        },
        ctaLink: {
          value: "#metrics",
          editable: true,
          label: "按钮链接"
        }
      }
    },

    // ---- [模块] 核心指标 ---- 关键数据，含受保护计算字段 ----
    {
      id: "metrics",
      name: "核心指标",
      comment: "关键数据展示（含受保护计算字段）",
      type: "metrics",
      visible: true,
      order: 2,
      fields: {
        dailyUsers: {
          value: 1280,
          editable: true,
          label: "日活用户",
          unit: "人",
          style: { fontSize: 32, fontWeight: 700, color: "var(--color-primary)" }
        },
        revenue: {
          value: 38.5,
          editable: true,
          label: "日收入",
          unit: "万元",
          style: { fontSize: 32, fontWeight: 700, color: "var(--color-success)" }
        },
        conversion: {
          value: 12.8,
          editable: true,
          label: "转化率",
          unit: "%",
          style: { fontSize: 32, fontWeight: 700, color: "var(--color-accent)" }
        },
        // --- 受保护字段：有计算关联 ---
        monthlyUsers: {
          value: 0,                        // 运行时由 compute 计算
          editable: false,
          protected: true,
          label: "月活预估",
          unit: "人",
          protectedReason: "由 dailyUsers × 30 天累计计算",
          compute: (f) => f.dailyUsers.value * 30,
          style: { fontSize: 32, fontWeight: 700, color: "var(--color-warning)" }
        }
      }
    },

    // ---- [模块] 项目简介 ---- 背景说明 ----
    {
      id: "intro",
      name: "项目简介",
      comment: "本季度业务背景说明",
      type: "text",
      visible: true,
      order: 3,
      fields: {
        heading: {
          value: "季度回顾",
          editable: true,
          label: "段落标题",
          style: { fontSize: 22, fontWeight: 600 }
        },
        body: {
          value: "本季度聚焦核心产品体验优化与用户增长。通过数据驱动的迭代策略，日活用户环比增长 23%，转化率提升 2.1 个百分点。下季度将继续深化增长飞轮，拓展新渠道。",
          editable: true,
          multiline: true,
          label: "正文",
          style: { fontSize: 15, lineHeight: 1.8, color: "var(--color-text-sub)" }
        }
      }
    },

    // ---- [模块] Q2 业绩表 ---- 受保护：含合计行与利润公式 ----
    {
      id: "q2-table",
      name: "Q2 业绩表",
      comment: "月度收入成本利润表（受保护）",
      type: "table",
      visible: true,
      order: 4,
      protected: true,
      protectedReason: "此表格含合计行与利润公式（利润=收入-成本），结构不可在面板修改，请在 config.js 中调整数据",
      fields: {
        columns: {
          value: ["月份", "收入(万)", "成本(万)", "利润(万)"],
          editable: false,
          protected: true,
          label: "表头列"
        },
        rows: {
          value: [
            ["4月", 120, 80, 40],
            ["5月", 135, 85, 50],
            ["6月", 150, 90, 60]
          ],
          editable: false,
          protected: true,
          label: "数据行"
        },
        totalRow: {
          value: [],
          editable: false,
          protected: true,
          label: "合计行",
          protectedReason: "由 rows 各数值列求和",
          compute: (f) => {
            const sums = ["合计", 0, 0, 0];
            f.rows.value.forEach(r => {
              sums[1] += r[1]; sums[2] += r[2]; sums[3] += r[3];
            });
            return sums;
          }
        }
      }
    },

    // ---- [模块] 重要提示 ---- 风险提示框 ----
    {
      id: "warning",
      name: "重要提示",
      comment: "下季度风险提示",
      type: "callout",
      visible: true,
      order: 5,
      fields: {
        title: {
          value: "注意事项",
          editable: true,
          label: "提示标题"
        },
        body: {
          value: "Q3 新渠道拓展存在不确定性，预计获客成本上升 15%。建议预留 20% 预算缓冲。",
          editable: true,
          multiline: true,
          label: "提示正文"
        },
        severity: {
          value: "warning",
          editable: true,
          label: "提示级别",
          options: ["info", "warning", "danger", "success"]
        }
      }
    },

    // ---- [模块] 路线图 ---- 季度里程碑 ----
    {
      id: "roadmap",
      name: "路线图",
      comment: "季度里程碑时间线",
      type: "timeline",
      visible: true,
      order: 6,
      fields: {
        events: {
          value: [
            { date: "2026 Q1", title: "立项启动", desc: "完成需求评审与技术选型" },
            { date: "2026 Q2", title: "核心上线", desc: "增长飞轮 V1 全量发布" },
            { date: "2026 Q3", title: "渠道拓展", desc: "新渠道接入与获客优化" },
            { date: "2026 Q4", title: "规模化", desc: "全渠道协同与商业化提速" }
          ],
          editable: true,
          label: "里程碑事件"
        }
      }
    },

    // ---- [模块] 核心功能 ---- 功能一览 ----
    {
      id: "features",
      name: "核心功能",
      comment: "本季度上线功能列表",
      type: "list",
      visible: true,
      order: 7,
      fields: {
        items: {
          value: [
            { title: "配置驱动", desc: "所有内容集中在 config.js，改配置即改页面" },
            { title: "实时编辑", desc: "右侧面板即时修改，所见即所得" },
            { title: "版本管理", desc: "v1/v2/v3 随时保存与回滚" },
            { title: "受保护标记", desc: "计算字段与复杂表格自动锁定" }
          ],
          editable: true,
          label: "功能项"
        }
      }
    }

  ],

  // ============================================================
  // 全局设置（编辑面板行为）
  // ============================================================
  settings: {
    showEditPanel: true,    // 加载时显示编辑面板
    panelWidth: 340,         // 面板宽度（px）
    panelPosition: "right"   // "right" | "left"
  }
};
