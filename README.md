# 迷星牌局 · MyGO!!!!! × Ave Mujica 纸牌游戏

MyGO!!!!! × Ave Mujica 双乐队纸牌馆，非官方同人网页游戏。

[立即游玩](https://yuriaqua.com/mygo/) · [官网](https://yuriaqua.com/#mygo) · [下载](https://github.com/toydream525/mygo-demo/releases/latest)

- 斗地主、跑得快、二十一点，与人物 AI 完整对局。
- 十位成员按乐队分组，操控所选角色参与牌局。
- 两套乐队主题、立绘衣橱与特色纸牌。
- 日文人物语音、场景差分和同桌互动，支持并行播放。
- 难度选择、提示与托管；斗地主提供经典和角色技能模式。
- 适配桌面与手机横屏，支持浏览器全屏，本地保存积分与偏好。

## 启动

需要 Node.js 20.19+ 或 22.12+。

```sh
npm install
npm run dev
```

打开终端显示的地址。

```sh
npm test
npm run build
npm run preview
```

生产文件位于 `dist/`，可部署到静态网站服务。下载包包含源码、素材与构建产物。

## 项目结构

- `src/`：界面、独立规则引擎、人物策略与音频管理。
- `public/`：运行所需的立绘、语音、音乐及模型。
- `scripts/`：验证与素材处理脚本。

## 说明

单机同人项目，不包含账号、支付或联机。角色与原作素材归各自权利人所有；素材、合成语音与模型来源见 [ASSETS.md](ASSETS.md) 及相应许可文件。人物策略和新增台词为同人设计。
