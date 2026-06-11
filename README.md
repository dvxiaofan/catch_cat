# 围住小猫 (Catch the Cat)

一款 9×9 六边形蜂窝网格上的策略小游戏。玩家点击空白格子放置障碍物，目标是在小猫逃到边界之前将其围住。

小猫每回合通过 BFS 寻路，向最近的边界方向移动一步。

> 设计为个人网站的 **404 页面彩蛋**——用户访问不存在的页面时，进入一个看似"404 页面不存在"的页面，然后发现"点击小圆点，围住小猫"。

## 功能特性

- **六边形网格** - 9×9 蜂窝布局，奇偶行偏移正确处理
- **BFS 寻路** - 小猫每回合用广度优先搜索找最短逃逸路径
- **手绘动画** - Canvas 实时绘制猫咪的蹲坐/跳跃两套姿态
  - 跳跃动画：抛物线高度 + 身体前倾 + 四肢摆动
  - 逃跑动画：连续跳跃冲向边界
  - 被困动画：原地挣扎摇晃
  - 尾巴自然摆动
- **零依赖** - 纯 HTML5 Canvas + 原生 JavaScript，无任何构建工具

## 技术栈

- HTML5 Canvas
- CSS3
- JavaScript (ES6+)
- 无任何第三方依赖

## 快速开始

### 在线试玩

启用 GitHub Pages 后访问：
[https://dvxiaofan.github.io/catch_cat/](https://dvxiaofan.github.io/catch_cat/)

### 本地运行

```bash
git clone https://github.com/dvxiaofan/catch_cat.git
cd catch_cat

# 任选一种启动本地静态服务器
npx serve .
# 或
python3 -m http.server 8000
```

然后在浏览器打开 `http://localhost:8000`

## 玩法

1. 游戏开始时，小猫位于网格中央，地图上随机分布 8 个障碍物
2. 鼠标点击空白格子放置障碍物（不能点猫所在格或已有障碍）
3. 放置后小猫自动 BFS 寻路，向最近的边界方向移动
4. 小猫到达边界 → 你输了
5. 小猫无路可逃 → 你赢了

## 作为 404 页面彩蛋嵌入

**方式 A：iframe 嵌入**
在网站 404 页面里嵌入：

```html
<iframe src="https://dvxiaofan.github.io/catch_cat/"
        style="width:100%;height:600px;border:none"></iframe>
```

**方式 B：直接替换 404**
将 `index.html` 部署为静态 404 页面（GitHub Pages、Vercel、Netlify 等都支持自定义 404）。

## 项目结构

```
catch_cat/
├── DESIGN.md         # 详细设计方案（数据结构、算法、UI 设计）
├── README.md         # 本文件
├── index.html        # 404 皮肤 + Canvas 容器
├── css/
│   └── style.css     # 404 页面样式 + 按钮
└── js/
    └── game.js       # 游戏核心逻辑
```

## 文档

详细的设计方案、数据结构、算法说明见 [DESIGN.md](./DESIGN.md)。
