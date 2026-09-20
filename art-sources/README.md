原始官方素材保持不变。每个 *-alpha.png 对应 portrait-manifest.json 的 source 按 crop 裁切后的透明蒙版；RGB 均来自原图。

最终采用 BiRefNet AI 抠图，保留相关布景；喵梦普通服补回原图鼓棒。未对脸、手进行生成式重绘或放大。半身/头像坐标按 comparisonScale 缩放，纵坐标先减 30，再加 comparisonPadY，避免丢掉扩展区域的角和鼓棒。
