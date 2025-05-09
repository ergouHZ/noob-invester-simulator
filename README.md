# 使用前须知
韭菜咨询模拟器
本项目仅供学习和研究使用。聚类和分析方法尚未经过验证，AI 的分析结果可能不完全准确，请勿将其作为投资建议或决策依据。请理性参考相关信息。

---

## 项目特性

- 通过 `newsorg` 接口定时抓取新闻（`top headlines` 每小时一次，`everything` 每24小时一次）并使用 SQLite 进行存储。
- 后端基于 Python Flask 构建，提供新闻接口，利用 KMeans 进行文本聚类后，将结果传送至 OpenAI 进行分析。
- 前端采用 React 架构，支持流式传输和交互式分析功能。

---

## 演示预览

- 演示链接：[//https://](https://noob-investor.dendi.top/app/)

---

## 使用说明

### 环境需求

- 后端
Python 3.11.8
pip 23.2.1

- 前端


### 准备工作

1. 注册 `newsorg` 账号，并获取免费 API Key。
2. 在 OpenAI 平台付费开通 API Key。
3. 克隆项目仓库：

   ```bash
    git clone https://github.com/ergouHZ/noob-investor-simulator.git
   ```

4. 在 /python_server/.env 文件中配置你的 API Key：
    NEWS_API_KEY=YOUR_KEY
    MY_OPENAI_API_KEY=YOUR_KEY


### 运行步骤
   ```bash
    cd /path/to/项目目录
    cd python_server
    pip install -r requirements.txt
    python app.py
   ```

- 前端已预配置并构建好，存放于 static 文件夹中。
- 你可以通过浏览器访问：
- http://127.0.0.1:5000/
- 若需自定义前端内容，可在 chat-app 目录中修改。

## 客制化配置
OpenAI 模型选择：修改 /python_server/.env 文件中的模型参数，推荐使用 GPT-4.5 模型。
模型建议：考虑成本和速度，默认为最经济快速的 Nano 版本。