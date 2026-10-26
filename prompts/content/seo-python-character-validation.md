# SEO Title 与 Meta Description｜Python 字符数精确校验

适用：需要严格限制 SEO Title（60 字符）和 Meta Description（160 字符）的官网文案生成与优化。

说明：使用 Python 的 `len()` 验证 Unicode 字符数，包含空格与标点。该方法验证的是字符上限，不能保证 Google 搜索结果一定完整显示；实际截断还受像素宽度、设备及搜索展示方式影响。

<!-- prompt:begin -->

请优化我提供的 SEO Title 和 Meta Description。

**严格要求：**
- SEO Title 不超过 60 字符。
- Meta Description 不超过 160 字符。
- 字符数包含空格、标点和品牌名称。

**执行规则：**
1. 先根据页面搜索意图和客户价值生成候选文案。
2. 必须实际调用 Python，使用 `len()` 精确计算字符数，不允许目测或自行估算。
3. 超出限制的候选必须淘汰，由 AI 重新改写，然后再次调用 Python 验证。
4. 只有通过 Python 验证的候选才能作为最终结果输出。
5. 最终显示完整文案及 Python 计算得到的真实字符数。
6. 不得通过机械截断、删除重要产品信息或制造不自然的表达来满足长度要求。
7. 如果无法调用 Python，必须明确告知，不得声称已经完成代码验证。

<!-- prompt:end -->
