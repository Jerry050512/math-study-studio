---
name: 数学研习室
description: 冷白与深松绿构成的大学出版社式数学研习界面
colors:
  ink: "#253b35"
  muted: "#607066"
  green: "#244f46"
  accent: "#447a62"
  line: "#e2e8e2"
  soft: "#edf2ec"
  white: "#ffffff"
  paper: "#f8faf8"
  sidebar: "#f0f4ef"
  navigation-active: "#dfe9dc"
  navigation-ink: "#244f3d"
  primary-ink: "#f4f8f1"
  primary-hover: "#346555"
  inverse-action: "#e5eddb"
  inverse-action-ink: "#2e5545"
  inverse-action-hover: "#f1f5e9"
  secondary-border: "#d5e0cf"
  secondary-ink: "#5d7b52"
  tab-surface: "#e4ecdf"
  tab-ink: "#38583e"
  lab-tab-ink: "#53694d"
  correct-surface: "#eaf3e1"
  retry-surface: "#fcf2e7"
  reading-border: "#dce5da"
  reading-focus: "#86a992"
  dark-paper: "#14211b"
  dark-panel: "#1a2a21"
  dark-panel-soft: "#223729"
  dark-ink: "#e2eade"
  dark-muted: "#abbcab"
  dark-border: "#34483b"
  dark-active: "#92b79d"
  dark-on-active: "#14251a"
  dark-focus: "#99bd9c"
typography:
  display:
    fontFamily: "'Noto Sans SC Variable', 'Microsoft YaHei', sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "0.02em"
  headline:
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.025em"
  title:
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.015em"
  body:
    fontFamily: "'Noto Sans SC Variable', 'Microsoft YaHei', sans-serif"
    fontSize: "14px"
    lineHeight: 1.7
  action:
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.7
rounded:
  tab: "6px"
  action: "7px"
  navigation: "8px"
  field: "9px"
  symbol: "10px"
  popup: "12px"
  drawer: "13px"
  feature: "14px"
spacing:
  compact: "7px"
  small: "12px"
  medium: "20px"
  section: "30px"
  reading-gap: "48px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.action}"
    padding: "11px 20px"
    typography: "{typography.action}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.white}"
  button-inverse:
    backgroundColor: "{colors.inverse-action}"
    textColor: "{colors.inverse-action-ink}"
    rounded: "{rounded.action}"
    padding: "10px 18px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.action}"
    padding: "9px 15px"
  navigation-active:
    backgroundColor: "{colors.navigation-active}"
    textColor: "{colors.navigation-ink}"
    rounded: "{rounded.navigation}"
    padding: "11px 13px"
  filter-selected:
    backgroundColor: "{colors.tab-surface}"
    textColor: "{colors.tab-ink}"
    rounded: "{rounded.tab}"
    padding: "7px 12px"
  search-field:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.field}"
    padding: "13px 17px"
  continue-panel:
    backgroundColor: "{colors.green}"
    rounded: "{rounded.feature}"
    padding: "30px 35px"
  reading-settings:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.popup}"
    padding: "20px"
    width: "308px"
  reading-settings-dark:
    backgroundColor: "{colors.dark-panel}"
    textColor: "{colors.dark-ink}"
    rounded: "{rounded.popup}"
    padding: "20px"
    width: "308px"
---

# Design System: 数学研习室

## Overview

**Creative North Star: "大学出版社的学科目录"**

界面以冷白纸面、深松绿、低饱和灰绿和精确细线建立秩序。中文内容保持安静，目录、公式、学习步骤和留白承担主要层级；小型函数图与学科符号帮助定位内容。

现代、美观、含蓄收敛是稳定的品牌约束。界面应支持连续阅读和主动推演，让状态清晰、入口明确，装饰服从学习内容。

**Key Characteristics:**

- 冷白纸面与深松绿主行动。
- 有编号、分级、细线的目录秩序。
- 数学符号与小型函数图构成学科气质。
- 扁平内容区、克制圆角与局部浮层。

## Colors

规范色值以顶部令牌为准，名称描述实际用途；这些名称不会要求重命名现有 CSS 自定义属性。

### Primary

- **深松绿 / green** 用于主按钮、继续研习面板、实验选中项与提示浮层。
- **灰绿 / accent** 用于链接悬停和轻量交互强调。
- **浅叶绿 / inverse-action** 用于深色继续研习面板中的反色行动按钮。

### Neutral

- **冷白纸面 / paper** 是全站背景；**white** 是搜索、输入与浮层表面。
- **深绿墨 / ink** 承担正文与标题，**muted** 承担次要信息。
- **目录灰绿 / sidebar** 区分常驻导航，**line** 和 **soft** 承担分隔与浅色层次。
- **navigation-active** 与 **tab-surface** 使用局部浅绿填充表示选择。
- **correct-surface** 与 **retry-surface** 区分理解检查反馈，同时配文字与图标传达结果。

**The Quiet Accent Rule.** 持续阅读区域保持冷白和墨色，深松绿留给明确的行动、选中状态和少量重点表面。

学科索引还使用米灰、蓝灰的符号底色和小点区分综合应用、线性代数；它们是分类标记，不承担通用交互语义。

深色外观沿用低饱和绿的纸面层次。dark-paper 为页面，dark-panel 为输入与阅读设置，dark-panel-soft 为轻量控件；dark-ink、dark-muted 与 dark-border 分别承担主文字、辅助文字和细线。dark-active 与 dark-on-active 成对用于主行动和选中项，dark-focus 用于聚焦反馈。阅读样式以语义变量覆盖既有颜色映射，保持原有目录与内容层级。真题图片保留浅色承托面，避免反转原图损伤内容。

## Typography

中文正文与标题使用本地打包的 Noto Sans SC Variable，并以 Microsoft YaHei、sans-serif 回退。公式由本地 KaTeX 样式与字体负责；不要用正文字符拼凑公式。图中变量可使用 Georgia。

首页展示标题采用 display，普通页面标题采用 headline，章节标题采用 title。实际课程标题为较大的阅读标题（32px）；三级标题为紧凑小标题（16px）。全局正文基础见 body，页面说明与教学内容按用途使用较小字号，较长富文本增加行高。

首页 display 在超宽视口增至 38px，中等视口为 29px，手机为 28px；手机页面标题为 27px，课程标题为 28px。标题保持中等字重，避免把整段说明加粗。来源标签、辅助元信息与按钮字阶明显小于正文。

**The Formula Fidelity Rule.** 数学表达式保持 KaTeX 渲染、原有条件与必要的横向滚动空间。

阅读设置提供标准、舒适、大号、特大四档（100%、110%、120%、130%），以阅读比例共同缩放正文、公式和练习。导航和工具文字保持紧凑。Zen 模式使用所选比例与 120% 中的较大值；桌面富文本基准为 16px、行高 2.05，手机为 14px，均继续乘以阅读比例。标题、导语、作答与解释使用各自的阅读字阶；笔记浮层维持独立工具字阶。

## Layout

桌面是常驻目录侧栏与主工作区。侧栏宽 232px，工作区同步左移；顶部栏高 77px。一般页面居中，最大宽 1260px，默认内边距为 46px 56px 35px。课程页最大宽 1320px，默认内边距为 30px 45px 45px。

课程正文和边注采用弹性主列加 190px 边栏，间距 48px。实验采用控制与图像的双列布局。目录使用连续行、细分隔线与序号，避免将每条内容都提升成浮动卡片。顶部继续研习面板采用双列，小型函数图与文案并置。

- **≥1500px:** 首页增加上方留白；课程边注增至 210px、间距增至 65px。
- **≤1150px:** 页面收紧边距；课程边注隐藏，实验改为上下排列。
- **≤800px:** 常驻侧栏收至 204px；工具栏与文字适度收紧。
- **≤600px:** 侧栏移出画面，通过菜单与遮罩展开；主区取消左移。顶部栏高 62px，普通页面水平内边距 22px，课程页为 20px。阶段导航可横向滚动；实验预览改为单列。

手机的继续研习函数图成为右下方低透明度的非交互背景，避免占据独立阅读宽度。表格与公式允许局部横向滚动。

Zen 模式将课程居中为最大宽 880px 的单列，内边距为 32px 40px 60px；上方保留高 62px、最大宽 900px 的粘性阅读栏。侧栏、普通顶栏、课程上下文与边注等辅助内容收起，五阶段导航与笔记入口继续可用。手机阅读栏高 54px，课程内边距为 24px 22px 40px；阶段导航继续允许横向滚动。退出后恢复常规工作区。

## Elevation & Depth

主要通过纸面、浅绿底色、边框与留白表达层次。标准目录行不使用阴影。全局阴影为 `0 14px 40px #253b3512`，用于笔记浮层和状态提示；主按钮悬停使用 `0 4px 14px #244f4617`。

阅读设置是局部浮层，浅色阴影为 `0 12px 34px #213d291c`，深色为 `0 12px 34px #00000038`，由配对的语义阴影变量控制。

**The Local Elevation Rule.** 阴影用于确实浮在页面之上的临时界面与轻微行动反馈。

## Shapes

圆角以紧凑、实用为主：操作按钮、筛选、搜索、导航、学科符号各有顶部记录的尺寸，重点面板使用 feature。进度条与步骤圆点可用圆形；不将所有容器统一做成胶囊。分隔线以细线为主，图形使用细轴线、浅色填充和适量虚线。

阅读设置采用 popup 圆角，介于学科符号与重点面板之间，保持临时工具的克制轮廓。

## Components

**Buttons.** 普通主按钮为深松绿底、浅色字；深色面板中的主按钮反转为浅叶绿底与绿墨字。次按钮为白底、淡绿边框。文字按钮小而安静，悬停加深并显示下划线。禁用按钮降低透明度并取消指针光标。

**Navigation.** 侧栏通过浅绿底、加深文字及中等字重表达当前页面。课程内的五阶段导航以底部细线、数字圆点和已完成勾号表达进程；手机保留完整阶段并允许横向滚动。

**Filters.** 学科筛选使用小圆角浅绿选中项。实验标签的选中状态使用深松绿底白字，未选中项保持浅绿底和较深的灰绿字。

**Inputs.** 搜索为白色描边容器，图标、输入与清除动作一行排列。长答案、反思与笔记采用有边框的文本域，标签位于上方；输入文字有足够行高并可纵向调整大小。

**Continue panel.** 深松绿表面承载当前单元标题；继续学习上下文位于标题下方，之后是识别信号、反色行动和元信息。函数图仅为辅助装饰，并从辅助技术中隐藏。

**Quiz feedback.** 选项使用边框与字母标记。提交后正确项为浅绿，错误选择为浅暖色；解释、文字结果和图标与颜色同时出现。重新作答是明确操作。

**Focus and motion.** 可聚焦操作使用 `3px solid #86a992` 轮廓，偏移 4px。普通按钮与链接的颜色、背景、阴影过渡为 0.18s；手机侧栏位移为 0.22s ease-out。`prefers-reduced-motion` 下关闭动画与过渡。搜索具有可访问名称，并支持 Ctrl/Cmd K；主内容提供跳转链接。

**Reading preferences.** 顶部工具提供浅色/深色切换、阅读设置与 Zen 入口。阅读设置浮层右对齐，距触发器 14px（手机 16px），最大宽度为视口减 32px；以有边框的表面、分组标签和浅底选项组织外观与字号，选中项使用成对的行动色。外观支持浅色、深色、跟随系统，偏好保存在当前浏览器。点击外部或按 Esc 关闭浮层；键盘关闭与关闭按钮将焦点送回触发器。Zen 可按 Esc 退出。

**Quiet reveal.** 阅读设置通过 170ms、`cubic-bezier(.16,1,.3,1)` 的透明度 0.82→1 与下移 3px→0 轻显。实验切换、提示、解答、测验反馈、推演步骤与笔记采用相同时长和缓动，透明度 0.85→1、下移 2px→0。搜索聚焦反馈为 150ms；这些变化接近无感，不作为阅读节奏或等待提示。`prefers-reduced-motion: reduce` 下跳过脚本轻显并关闭这些 CSS 动画与过渡。

## Do's and Don'ts

### Do:

- **Do** 使用目录行、编号和细线建立阅读顺序。
- **Do** 为深色表面采用浅色文字及反色行动按钮。
- **Do** 保留公式、完整题干与来源信息的阅读空间。
- **Do** 同时用文字、图标或形状表达状态。

### Don't:

- **Don't** 把每一段教学内容都装进有阴影的卡片。
- **Don't** 用高饱和装饰取代含蓄的冷白与灰绿秩序。
- **Don't** 为装饰性图形压缩手机正文或截断公式与表格。
- **Don't** 将自评进度表现成已验证的能力认证。

<!-- Extraction: src/style.css, src/main.jsx, src/ReadingPreferences.jsx, src/reading.css and src/theme-tokens.css, 2026-10-29. This document records the implementation; it does not certify visual QA, deployment, or content correctness. -->
