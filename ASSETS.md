# 素材与语音来源

## 图像

MyGO 使用官方卡面半身裁切，原有生成版人物已移除。练习室背景为此前生成素材。Ave Mujica 使用明日方舟联动演出服与联动时装的原图抠图，不重新生成脸部、手部或姿势。

## 日文角色语音

- 实际合成服务：[Plana-Archive / BanG-Dream-VITS](https://huggingface.co/spaces/Plana-Archive/BanG-Dream-VITS)。
- 模型来源：服务代码使用 `Plana-Archive/Anime-Models` 中的 `Anime-VITS/MyGO-AveMujica-VITS`，按 `燈 / 愛音 / 楽奈 / そよ / 立希` 选择说话人。
- 参考项目：[Mahiruoshi / BangDream-Bert-VITS2](https://huggingface.co/spaces/Mahiruoshi/BangDream-Bert-VITS2)。其日语站能打开，但本次实际推理失败，最终使用上面的同角色 VITS 服务生成。
- 文本核对：[Mahiruoshi / MyGO_VIts-bert / filelists/Mygo.list](https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert/blob/main/filelists/Mygo.list)，选用手游 MyGO 剧情中的极短日常对白。
- 精确台词、中文翻译和原始剧情片段编号见 `src/voice-lines.json`；生成记录见 `voice-generation.json`。
- 共 110 段 **AI 合成语音，不是原声录音**。每角色最初 2 条（共 10 条）为核对过的原作短句；另外 100 条是适合人物性格的同人报牌、技能与互动台词，不冒称原作台词。JSON 的 kind 字段区分 original 与 fan。
- 普通出牌语音限频；特殊牌型和技能有专用语音；农民队友可回应，主动互动有 8 秒冷却。所有 mp3 随项目提供，运行时不调用合成服务。

## 歌曲主题设计

歌曲题签与演出名称依据官方曲目表：
- [迷跡波](https://bang-dream.com/discographies/3457/)
- [跡暖空](https://bang-dream.com/discographies/3846/)
- [致並跡](https://bang-dream.com/discographies/4165/)

牌面与演出中的星轨、雨幕、火种、双线伴走是本 demo 的同人视觉解释，不代表官方设定。牌面由矢量图形和文字构成，未复制专辑封面或歌词。歌名不改变牌型、点数或结算。

## 音乐与音效

- `public/audio/night-rehearsal.mp3`：原创 48 秒循环合成配乐「夜の練習室」，拨弦、柔和键盘与低音，不是 MyGO 原曲。
- 出牌、选牌、发牌、炸弹和结算音效由 Web Audio 本地合成。
- 声音设置可导入用户本机的原版音乐进行循环播放，不上传音频；导入选择只对当前页面有效，刷新回到默认曲。
- 背景音乐、角色语音、音效有独立音量，语音播放时自动降低背景音乐音量。

MyGO!!!!!、角色及原作台词属于各自权利人；本项目是非官方本地同人 demo。此说明记录来源，不代表官方授权或官方合作。


## 2026-09-20 官方卡面与衣橱

默认使用《BanG Dream! 少女乐团派对》MyGO!!!!! 官方特训后卡面立绘，由 Bestdori 资源镜像取得；作品权利归 BanG Dream! Project / Craft Egg / Bushiroad，本站为非官方同人 demo，不声称图片为自制或已获官方授权。

- 高松灯：1823「心の叫び」，res036004。
- 千早爱音：1824「迷いながら」，res037004。
- 要乐奈：1853「コインパーキングの猫」，res038005。
- 长崎素世：1825「終わらせてあげる」，res039004。
- 椎名立希：1852「私と、取引しよう」，res040005。

卡片页 `https://bestdori.com/info/cards/<编号>`；图像源 `https://bestdori.com/assets/jp/characters/resourceset/<资源名>_rip/trim_after_training.png` 与 `card_after_training.png`。`public/art/official/` 保留卡面与透明立绘原图，衣橱有来源链接。

原有生成衣橱已移除；当前 MyGO 仅保留官方卡面。

## 场景语音增补

每名角色新增索引 16–21 共 6 条：16–18 首页、19–20 牌桌、21 对局结束。均为本 demo 新写日文同人台词，不宣称来自原作。使用既有 MyGO 专用 VITS 服务（plana-archive-bang-dream-vits.hf.space）按角色声线合成，音频与生成记录随源码提供；总计 110 条。

## AI 模型与运行库

见 `public/ai/NOTICE.txt`、Apache-2.0 与 MIT 许可证、数值一致性报告。模型来源与镜像版本在 NOTICE 中明确区分。

## Ave Mujica 本轮素材

- 官方联动来源：https://arknights.jp/news/2603 。素材镜像：https://github.com/ratrackgames/ArknightsAssets 。
- 使用 `char_4184_dolris`、`char_4183_mortis`、`char_4186_tmoris`、`char_4185_amoris`、`char_4182_oblvns` 的 `_2` 与 `_avemujica#1` 图。透明蒙版为本项目制作，原图权利归原权利人。
- `art-sources/` 保留原图与蒙版；`portrait-manifest.json` 记录裁切。新增立绘未使用生成式重绘。
- 语音使用上述 Plana-Archive 服务中的 初華、睦、海鈴、にゃむ、祥子，对应角色独立声源。睦/Mortis 共用睦声源，分别编写台词。144 段为 AI 合成；全部新增台词为同人原创，不是原声录音。
- 新增台词与译文见 `src/mujica-voice-lines.json`，记录见 `mujica-voice-generation.json`。
- 四首现有配乐分别为 `mygo-lobby`、`mygo-table`、`mujica-lobby`、`mujica-table`，按角色所属乐队与场景切换，不冒称官方曲。

### 最终透明素材（2026-09-20）

十张采用 [BiRefNet](https://github.com/ZhengPeng7/BiRefNet) AI 背景移除，模型来自 [rembg 官方发布](https://github.com/danielgatis/rembg/releases)。原图 RGB 不改动；喵梦演出服补回原图鼓棒，祥子联动时装保留双角。按用户选择保留人物相关布景，原图与最终 alpha 记录在 art-sources。

### 全员场景差分（2026-09-20）

十人以及单独配置的 Mortis，各新增首页、入座、出牌、不出、互动、回应、胜利、失利、技能九类场景，每类两句，共 198 段。台词均为同人原创，见 `src/voice-expansion.json`；角色声源及生成结果见 `voice-expansion-generation.json`。祥子和 Mortis 原有的 48 段另行重写并重制，见 `voice-character-revision.json`。Mortis 仍使用睦的模型，以台词和语速区分，不声称是独立的 Mortis 模型。新增音频与现有并行播放、按角色字幕及音乐压低共用同一播放接口。

### 角色视角修订

设定为玩家直接操控所选角色，不存在额外入席的玩家人物。十名角色及 Mortis 的三条首页台词改为角色独白，共重新合成 33 段；文件使用 `-perspective.mp3` 后缀，记录见 `voice-perspective-generation.json`。首页旧问候音频不再被路由调用。牌桌互动对象为同桌角色，字幕标明双方姓名；角色正常第一人称及对同桌成员的第二人称保留。
