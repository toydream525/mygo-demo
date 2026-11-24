<div align="center">

<img src="public/star.svg" width="76" height="76" alt="迷星牌局徽标" />

# 迷星牌局 · MyGO!!!!! × Ave Mujica

**MyGO!!!!! × Ave Mujica 双乐队纸牌馆 · 非官方单机同人网页游戏**

<p>
  <strong>简体中文</strong> &nbsp;|&nbsp; <a href="./README.en.md">English</a>
</p>

<p>
  <a href="https://yuriaqua.com/mygo/"><img src="https://img.shields.io/badge/Play-yuriaqua.com%2Fmygo-4f6df5.svg?style=flat-square" alt="Play Online" /></a>
  <img src="https://img.shields.io/badge/Games-%E6%96%97%E5%9C%B0%E4%B8%BB%20%7C%20%E8%B7%91%E5%BE%97%E5%BF%AB%20%7C%2021%E7%82%B9-7c4dff.svg?style=flat-square" alt="Card Games" />
  <img src="https://img.shields.io/badge/Built%20with-TypeScript%20%2B%20Vite-3178c6.svg?style=flat-square" alt="TypeScript + Vite" />
  <a href="https://github.com/toydream525/mygo-demo/releases/latest"><img src="https://img.shields.io/badge/Release-Download-2ea043.svg?style=flat-square" alt="Release" /></a>
</p>

<p>
  <a href="https://yuriaqua.com/mygo/"><strong>🎮 立即在线游玩</strong></a> &nbsp;·&nbsp;
  <a href="https://yuriaqua.com/#mygo">🌐 项目官网</a> &nbsp;·&nbsp;
  <a href="https://github.com/toydream525/mygo-demo/releases/latest">⬇️ 下载离线包</a> &nbsp;·&nbsp;
  <a href="./ASSETS.md">📜 素材与许可说明</a>
</p>

</div>

---

## ✨ 游戏特色

> [!NOTE]
> **非官方同人声明：** 本项目为单机同人网页游戏，不包含账号、支付或联机功能。角色与原作素材归各自权利人所有；素材、合成语音与 AI 模型来源详见 [ASSETS.md](ASSETS.md) 及对应许可文件。人物策略与新增台词均为同人创作。

| 模块 | 内容说明 |
| :--- | :--- |
| **🃏 三种完整牌局** | 支持 **斗地主**、**跑得快**、**二十一点**，与具备独立策略的人物 AI 完整对局 |
| **🎸 双乐队十位成员** | MyGO!!!!! 与 Ave Mujica 共十位成员按乐队分组，自由选择操控角色入局 |
| **🎨 双主题与立绘衣橱** | 两套专属乐队视觉主题、角色立绘衣橱切换与特色纸牌牌面 |
| **🎙️ 语音与同桌演出** | 日文人物语音、场景表情差分与同桌互动反应，支持并行播放 |
| **⚡ 难度与角色技能** | 支持难度选择、出牌提示与托管；斗地主提供「经典模式」与「角色技能模式」 |
| **📱 全端横屏适配** | 适配桌面与手机横屏浏览，支持浏览器全屏，本地保存积分与个人偏好 |

---

## 🚀 本地运行与构建

**环境要求：** Node.js `20.19+` 或 `22.12+`。

```sh
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器
npm run dev
```

打开终端显示的本地地址即可游玩。

```sh
# 运行测试
npm test

# 构建生产静态文件（输出至 dist/，可部署到任意静态网站服务）
npm run build

# 本地预览生产构建
npm run preview
```

> Release 下载包同时包含源码、运行素材与构建产物。

---

## 🗂️ 项目结构

```text
mygo-demo/
├── src/        # 游戏界面、独立规则引擎、人物 AI 策略与音频管理
├── public/     # 运行所需的角色立绘、日文语音、背景音乐与 ONNX 模型
├── scripts/    # 校验与素材处理脚本
└── ASSETS.md   # 素材、语音及模型来源与许可清单
```

---

## 📜 版权与素材说明

<div align="center">

角色与原作素材归各自权利人所有 · 第三方素材与模型许可详见 [**ASSETS.md**](ASSETS.md)<br />
<sub>纯单机同人作品 · 无账号 · 无支付 · 无广告 · <a href="https://yuriaqua.com/mygo/">YuriAqua</a></sub>

</div>
