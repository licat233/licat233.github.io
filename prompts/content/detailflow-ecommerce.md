# DetailFlow｜连续式八屏电商产品详情页制作工作流

接下来请严格使用 DetailFlow 工作流帮我制作产品详情页。

**DetailFlow Skill：** https://github.com/AJbeckliy/detail-flow

开始任务前，请先读取并遵循该 Skill 的最新规则，尤其是：

- Image Generation Workflow
- Ecommerce 8-screen product detail page
- Continuity Rules
- Revision Routing
- Post-generation Audit

这是正式电商详情图生产任务，不是概念草图、PPT、Brochure、Infographic、Moodboard 或视觉实验。

## 一、核心目标

最终需要制作一套 **8-screen ecommerce product detail page**。

这 8 屏必须看起来像：

> “一张连续电商长详情页的 8 个连续片段”

而不是：

- “8 张彼此独立的宣传海报”
- “8 张 PPT”
- “8 张信息图”
- “8 张社交媒体广告”
- “1 张总览图拆成 8 张”

最终图片必须达到可以直接用于真实电商产品页面的商业质量。

## 二、信息与素材优先级

始终按照以下优先级处理信息：

1. 用户明确确认的事实
2. 用户提供的正式产品资料、参数、包装信息、说明书、页面资料
3. 用户提供的真实产品图片 / 视频截图
4. 已确认的 Blueprint
5. 已确认的 Text Master / Visual Master / Style Reference
6. 图片中可以合理观察到的信息
7. AI 合理推断
8. AI 自由创意

低优先级内容不得覆盖高优先级事实。

如果不同资料之间存在冲突：

- 明确指出冲突
- 不擅自选择其中一个版本作为事实
- 优先采用保守表达
- 将问题写入 risk_unknowns
- 如该信息会影响商业准确性，则等待确认后再使用

## 三、Analyze Inputs

收到产品素材后，不要立即生成最终详情图。

先分析用户提供的：

- 产品实拍图
- 产品白底图
- 产品细节图
- 包装图
- 配件图
- 使用 / 安装 / 场景图
- 产品参数
- 产品页面
- 产品说明书 / 文档
- 品牌资料
- 风格参考图
- 竞品参考图（如果有）
- 用户特别要求保留或禁止出现的内容

分析结果必须严格分成四类：

**A. Confirmed Facts**

用户或正式资料明确确认的事实

**B. Observed Facts**

可以直接从图片中观察到的事实

**C. Reasonable Inferences**

AI 基于产品类别、结构、视觉信息做出的合理推断

**D. Unknown / Do Not Invent**

未知、冲突、无法确认、不能擅自编造的信息

禁止擅自补充例如：

- 未确认技术参数
- 未确认材料
- 未确认功能
- 未确认认证
- 未确认奖项
- 未确认测试数据
- 未确认性能数据
- 未确认销量
- 未确认转化率
- 未确认医疗 / 功效声明
- 未确认耐久性
- 未确认防护等级
- 未确认品牌合作
- 未确认专利
- 未确认折扣
- 未确认保修
- 未确认 MOQ
- 未确认交期
- 未确认物流承诺
- 未确认包装内容

## 四、Product Identity Lock

如果用户已经提供真实产品图片，必须建立 Product Identity Lock。

Product Identity Lock 用于记录该产品不可随意改变的真实视觉特征，例如：

- 整体外形
- 长宽比例
- 厚度
- 颜色
- 材质
- 表面纹理
- Logo / 品牌标识
- 包装设计
- 图案
- 按钮
- 开孔
- 接口
- 屏幕
- 旋钮
- 拉链
- 把手
- 支架
- 连接结构
- 配件
- 特殊造型
- 产品数量
- 组件之间的位置关系

不同产品只需要锁定与该产品真正相关的特征。

原则：

> “产品真实性高于画面更漂亮。”

如果 AI 美化会导致产品变成另一个 SKU、另一个结构、另一个颜色或另一种材料，则不得采用。

当真实产品素材足够时：

优先使用“真实产品素材 + AI 场景 / 环境 + 专业排版”，而不是“让 AI 根据产品图重新画一件类似产品”。

## 五、Style Reference Analysis

如果用户提供风格参考图，不要只分析颜色。

必须提取：

- palette
- lighting
- contrast
- camera angle
- lens language
- depth of field
- composition
- negative space
- product scale
- typography
- information hierarchy
- icon language
- label / badge style
- material treatment
- scene density
- visual rhythm
- background world
- recurring motifs
- transition language
- commercial photography level

参考图用于提取 Style DNA。

不要复制：

- 原参考图品牌
- 原参考图人物身份
- 原参考图文字
- 原参考图产品
- 原参考图商标

如果用户明确确认某一张参考图或 visual master，它必须成为后续页面的强视觉约束，不能仅作为“灵感”。

## 六、8-screen Detail Page Blueprint

第一阶段必须输出完整的 8-screen Detail Page Blueprint。

每屏至少包括：

- slice_id
- buyer_question
- module_type
- module_label
- claim_seed
- screen_job
- evidence_type
- content_density
- layout_archetype
- copy_module_type
- copy_structure_pattern
- primary_module
- secondary_modules
- text_exact
- hierarchy_strategy
- composition_shift
- top_edge_anchor
- bottom_edge_anchor
- visual_composition
- reference_style_notes
- risk_unknowns

## 七、Claim Seed 规则

Screen 01 必须先建立 2–4 个核心 claim seeds。

这些 seeds 应该：

- 足够重要，可以支撑完整购买决策
- 足够具体，可以在后续页面被证明
- 不应该只是空洞形容词
- 不应该是未经确认的技术或商业声明

Screen 02–08 必须围绕这些 seeds：

- 展开
- 解释
- 证明
- 对比
- 展示细节
- 场景化
- 建立信任
- 收束购买决策

不要每一屏重新发明一个卖点。

如果后面的页面无法追溯到 Screen 01 的 seed，要么修改 seed，要么修改该页面内容。

## 八、页面差异化规则

每一屏必须回答不同的 buyer_question。

相邻页面不得机械重复：

- 相同 screen_job
- 相同 evidence_type
- 相同构图
- 相同标题结构
- 相同“标题 + 副标题 + 3 图标”
- 相同产品 Hero 比例
- 相同信息卡布局

8 屏需要变化信息密度和视觉组织方式。

可以混合：

- hero
- macro detail
- feature proof
- mechanism
- comparison
- step sequence
- scenario
- annotation map
- specification proof
- trust section
- configuration
- closing CTA

但必须属于同一个视觉系统。

## 九、内部字段禁止出现在正式图片

以下 Blueprint / workflow 字段只能内部使用：

- slice_id
- module_type
- module_label
- screen_job
- claim_seed
- evidence_type
- content_density
- risk_unknowns

除非用户明确要求，否则：

不要在正式详情页可见区域显示：

- 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08
- Screen 01
- Product Overview
- Feature Breakdown
- Parameter Trust
- FAQ
- Module
- Section
- Blueprint 类标签

文件名可以有：

product_screen_01.png

但页面画面里不应该自动出现：

01

实际内容中的步骤编号，例如 1.、2.、3.，可以正常使用。

## 十、Approval Gate 1

Blueprint 完成后必须停止。

等待用户第一次确认。

未经确认：

- 不生成最终详情图
- 不生成正式 slice
- 不进入正式视觉生产阶段

## 十一、第一次确认后的 Master 阶段

第一次确认后建立：

1. Text Master
2. Visual Style DNA
3. Visual Master Spec
4. Product Identity Lock
5. Structure Blueprint
6. 如适合，生成 1:3 continuous long-page visual master

Visual Master Spec 至少需要锁定：

- palette
- lighting direction
- background world
- product rendering strategy
- typography
- spacing system
- information hierarchy
- material language
- icon language
- camera language
- product scale rhythm
- section rhythm
- transition logic
- recurring motifs
- negative space rules

## 十二、1:3 Visual Master 规则

1:3 master 只是视觉连续性母版。

它不是正式成品。

不得：

- 直接作为最终详情图
- 直接裁成 8 个正式 slice
- 从 master 放大生成正式图
- 从 master 截图作为正式图
- 把 master 当 contact sheet
- 为了省事把 master 拆成最终交付

1:3 master 只用于统一：

- 背景世界
- 空间
- 光线
- 色彩
- 产品尺度
- 视觉节奏
- Typography
- 信息层级
- 页面连续性
- 上下过渡关系

如果 master 出现以下问题，应判定失败：

- 像 8 张独立海报
- 像 PPT
- 像 Brochure
- 像 Infographic Grid
- 像 Contact Sheet
- 产品结构漂移
- 风格偏离 reference
- 页面没有连续空间逻辑
- 信息层级与 Blueprint 不一致

失败的 master 不得用于正式 slice 生产。

## 十三、正式 Slice 的生产规则

Master 通过后，先制作：

- Slice 01
- Slice 02

默认最终比例：**9:21 vertical**，除非用户另行指定。

每个正式 slice 必须独立制作。

不得把以下内容直接转换成正式 slice：

- 1:3 master
- 总览图
- Contact Sheet
- Moodboard
- Blueprint 图
- 低分辨率草图
- Preview 图

如果构图比例与最终比例不匹配：

正确做法：

- 重新构图
- 调整布局
- 重新生成环境
- 合理 outpainting
- 重新安排产品和文字模块

错误做法：

- Gaussian Blur 补边
- 镜像补边
- 拉伸
- 强行放大
- 低分辨率裁切
- 用背景模糊强行凑比例
- 加巨大边框掩盖比例问题

## 十四、产品真实素材使用原则

如果用户提供真实产品图：

优先尽可能保留真实产品主体。

AI 更适合处理：

- 环境
- 场景
- 道具
- 光线
- 空间延展
- 背景
- 氛围
- 非关键装饰元素

对于产品本身：

任何生成结果如果改变了 SKU identity，必须判定为失败。

包括但不限于：

- 产品形状变化
- 配色变化
- Logo 变化
- 材料变化
- 图案变化
- 接口变化
- 组件数量变化
- 结构变化
- 包装文字变化
- 关键部件消失或增加

## 十五、文字规则

Blueprint 的 text_exact 是正式文案权威来源。

重要内容例如：

- headline
- subtitle
- specifications
- dimensions
- model
- feature names
- steps
- CTA
- warnings
- certification text

不得让图像模型自由改写。

优先采用：

- 为文字预留区域
- 后置排版
- 确定性 Typography
- 可控字体系统

如果 AI 生成图片中的重要文字出现：

- 拼写错误
- 数字错误
- 单位错误
- 乱码
- 漏字
- 文案被改写

必须修复。

不得因为“整体画面不错”而忽略文字错误。

## 十六、Slice 01–02 内部 Audit

生成前两屏后，逐张检查：

### Product Identity

- 产品是否保持真实
- SKU 是否变化
- 外形是否漂移
- 颜色是否漂移
- 材质是否变化
- Logo 是否正确
- 结构是否正确

### Copy

- 是否与 text_exact 一致
- 拼写是否正确
- 参数是否正确
- 单位是否正确
- 是否出现乱码
- 是否出现内部字段
- 是否出现不需要的页面编号

### Claim Safety

- 是否增加未经确认参数
- 是否增加认证
- 是否增加效果数据
- 是否增加虚假商业声明
- 是否增加奖项或品牌合作

### Commercial Quality

- 是否像真正的电商详情图
- 是否有明显 AI 生成痕迹
- 是否像草图
- 是否像 PPT
- 是否像信息图
- 是否像廉价促销海报
- 产品是否足够清晰
- 视觉层级是否专业

### Continuity

- Slice 01 与 Slice 02 是否属于同一个长页面
- 光线是否一致
- Typography 是否一致
- 产品表现是否一致
- 背景世界是否一致
- 是否存在上下视觉衔接
- 是否避免连续两个完整 Hero

任何关键项失败：先返修，通过后再进入确认。

## 十七、2-Slice Preview

前两屏通过内部审核后：

制作 2-slice concat preview。

Preview 只用于检查页面连续性。

不得因为制作 Preview：

- 修改正式 slice
- 给 slice 加模糊背景
- 加边框
- 重排版
- 改产品
- 改文字
- 改比例

Preview 应该只是正式图的原样拼接预览。

## 十八、Approval Gate 2

一起提供：

- 1:3 visual master（如果使用）
- Slice 01
- Slice 02
- 2-Slice Preview
- 简短 Audit

然后停止。

等待用户第二次确认。

## 十九、第二次确认后

第二次确认后才生成：

**Slice 03–08**

继续严格遵循：

- approved Blueprint
- approved Text Master
- approved Product Identity Lock
- approved Visual Style DNA
- approved Visual Master

不要在后半程重新设计视觉系统。

## 二十、Full-page Audit

8 屏完成后必须制作完整拼接预览并检查：

### Product Consistency

产品身份是否始终一致

### Text Accuracy

所有文案、参数、数字、单位是否正确

### Claim Continuity

所有主要卖点是否可以追溯到 Screen 01 claim seeds

### Visual Continuity

是否像同一张长页面

### Composition Variety

是否避免连续重复相同布局

### Unsupported Claims

是否出现任何用户未确认内容

### Commercial Readiness

必须问：

> “如果不向客户解释制作过程，这 8 张图能否直接放到真实产品详情页？”

如果答案是否，则不能判定任务完成。

## 二十一、失败判定

以下情况应直接判定为失败，不应继续往后制作：

- 产品被 AI 改成另一款
- 产品结构明显错误
- Logo / 包装 / 图案明显错误
- 关键文字错误
- 关键参数错误
- 出现未经确认认证或声明
- 与确认风格明显不同
- 每一屏都像独立海报
- 页面连续性消失
- 正式图来自低分辨率总览图拆分
- 使用模糊补边强行满足比例
- 结果明显只是“草图质量”

**“生成完成”不代表“质量通过”。**

## 二十二、返修原则

优先进行最小范围返修：

- 文案错误 → 只修文字层
- 产品错误 → 只修产品层
- 背景错误 → 只修场景 / 背景
- 单屏构图问题 → 只修该 Slice
- 相邻屏连接问题 → 只修相邻页面过渡
- 多个页面风格漂移 → 回到 Visual Master
- 卖点逻辑错误 → 回到 Blueprint

不要默认整套重新生成。

也不要用以下方式掩盖问题：

- 模糊
- 镜像
- 强行放大
- 边框
- 裁掉错误区域
- 大量图标填补空白
- 从总览图重新拆图

## 二十三、最终交付

最终需要交付：

- Approved Visual Master（如果使用）
- Slice 01–08 高清正式图
- 2-Slice Preview
- Full-resolution Long-page Concat
- Lightweight Long-page Preview
- ZIP Package

文件名可以使用：

- product_screen_01.png
- product_screen_02.png
- ...
- product_screen_08.png

但文件编号不代表画面内必须出现编号。

## 二十四、默认海外市场要求

除非我特别说明：

- 最终可见文案使用英文
- 风格符合国际 B2B / ecommerce 视觉
- 文案具体、克制、可信
- 避免廉价促销感
- 避免 AI 营销腔
- 避免 PPT 感
- 避免 infographic template 感
- 避免 brochure 感
- 不编造技术或商业声明
- 不为了视觉效果牺牲产品真实性
- 不为了填满版面而增加无关卖点

## 二十五、页面序号禁忌

最终买家可见的详情图中，禁止出现按页面顺序编号的序号，例如：

- 第 1 张显示 “1” / “01” / “Screen 1” / “01 Product Overview”
- 第 2 张显示 “2” / “02” / “Screen 2”
- 第 3 张显示 “3” / “03”
- ...
- 第 8 张显示 “8” / “08”

也就是说：

详情图的第几屏，只能作为内部工作流和文件管理信息，不能自动变成页面可见设计元素。

允许：

- 文件名：product_screen_01.png
- Blueprint 内部字段：slice_id: 01
- 制作管理中的 Screen 01 / Slice 01
- 实际内容中的步骤编号，例如 1 / 2 / 3 / 4
- 参数编号、型号编号、数量编号等真实内容

禁止：

- 用 01–08 给 8 张详情图逐页编号
- 把页面序号做成左上角大数字
- 把 “01 / PRODUCT OVERVIEW” 作为详情页标题装饰
- 把 “02 / FEATURES” “03 / APPLICATIONS” 等作为章节编号
- 因为是 8-screen 工作流，就在视觉上显示 8 个序号

默认原则：

> “8-screen” 是制作和切片概念，不是买家可见的页面编号系统。

除非用户明确要求章节编号，否则最终详情图不应出现任何按屏幕顺序递增的 01、02、03……视觉元素。

最终目标：

> “专业、真实、连续、可以直接上线的 ecommerce product detail page”

现在我会提供产品图片和产品资料。

**请严格从 DetailFlow 的 Analyze Inputs 阶段开始。**
