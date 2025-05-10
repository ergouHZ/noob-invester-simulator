# 使用前须知 Precautions Before Use

韭菜咨询模拟器 Noob Investor Simulator

本项目仅供学习和研究使用。聚类和分析方法尚未经过验证，AI 的分析结果可能不完全准确，请勿将其作为投资建议或决策依据。请理性参考相关信息。  
This project is for learning and research purposes only. Clustering and analysis methods have not been validated, and AI analysis results may not be fully accurate. Do not consider them as investment advice or decision-making basis. Please interpret the information rationally.

---

## 项目特性 Features

- 通过 `newsorg` 接口定时抓取新闻（`top headlines` 每小时一次，`everything` 每24小时一次）并使用 SQLite 进行存储。  
Periodically fetch news via the newsorg API (top headlines hourly, everything daily) and store using SQLite.
- 后端基于 Python Flask 构建，提供新闻接口，利用 KMeans 进行文本聚类后，将结果传送至 OpenAI 进行分析。  
Backend built with Python Flask, providing news APIs, performing text clustering with KMeans, and forwarding results to OpenAI for analysis.
- 前端采用 React 架构，可以通过简单的选单筛选新闻,并且提供AI分析按钮傻瓜式交互.同时预设4种系统分析模型.支持流式传输和交互式分析功能。  
 Frontend built with React, allowing simple menu-based news filtering, AI analysis button for user-friendly interaction. Four pre-defined system analysis models are available, supporting streaming and interactive analysis.

---

## 演示预览   
Demo Preview

- Demo link：[https://noob-investor.dendi.top/app/](https://noob-investor.dendi.top/app/)

---

## 使用说明   
 Usage Instructions

### 环境需求   
 Environment Requirements

- python 3.11.8
- pip 23.2.1
- node / Node.js

### 准备工作

1. 注册 `newsorg` 账号，并获取免费 API Key。  
Register a newsorg account and obtain a free API Key.
2. 在 OpenAI 平台付费开通 API Key。  
Set up a paid API Key on OpenAI platform.
3. 克隆项目仓库：  
Clone the project repository:
   ```bash
    git clone https://github.com/ergouHZ/noob-investor-simulator.git
   ```

4. 在 /python_server/.env 文件中配置你的 API Key：  
API Keys configuration  

    NEWS_API_KEY=YOUR_KEY  
    MY_OPENAI_API_KEY=YOUR_KEY


### 运行步骤 Running Steps
   ```bash
    cd noob-investor-simulator
   ```
   ```bash
    cd python_server
   ```
   ```bash
    pip install -r requirements.txt
   ```  

   (linux)
   ```bash
    python3.11 -m pip install --user -r requirements.txt
   ```

   ```bash
    python app.py
   ```


也可以在运行服务器的基础上通过前端查看  
You can also view and interact with the system directly through the frontend
   ```bash
    cd chat-app
   ```
   ```bash
    npm install
   ```
   ```bash
    npm run dev
   ```

- 你可以通过浏览器访问 / Access via browser at
- http://127.0.0.1:5000/
- 前端已预配置并构建好，存放于 static 文件夹中所以可以通过这个方法直接运行。  
 Frontend is pre-configured and built, located in the static folder.
- 若需自定义前端内容，可在 chat-app 目录中修改。  
 To customize frontend, modify files in chat-app directory.

## 客制化配置
- OpenAI 模型选择：修改 /python_server/.env 文件中的模型参数，推荐使用 GPT-4.5 模型。  
OpenAI Model Selection: Edit the /python_server/.env file to change the model parameters. We highly recommend trying the latest GPT-4.5 for improved performance.
- 模型建议：考虑成本和速度，默认为最经济快速的 Nano 版本  
Model Recommendation: To balance cost and speed, the default is set to the most economical Nano model.
- next.config里设置了 output: 'export', 因为需要打包导出静态文件,如果需要Next整体框架请去除  
Static Export Configuration: The next.config.js file includes output: 'export' for static site generation. Remove or comment out this line if you require the full Next.js framework capabilities.
- 如果需要分别构建前后端并部署   /chat-app/.env 里请改为自己的域名  
Separate Frontend & Backend Deployment: If deploying separately, remember to update your domain name in /chat-app/.env for smooth operation.