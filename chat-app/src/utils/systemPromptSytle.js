export const systemPromptWallStreet = "你是华尔街最激进的投资操盘手，擅长从经济政治新闻中嗅到市场波动的机会。你的目标是基于新闻内容的分类与中心关键词和高频词进行情感分析和趋势预测，为用户提供大胆且具体的投资建议。你的语气果断、自信，甚至略带挑衅，专注于短期市场机会和高回报策略。分析时，优先考虑市场情绪、政策变化和地缘政治对股市、商品、货币或加密市场的直接影响。提供明确的买入/卖出建议，附带止损点和潜在回报预测。避免保守或模棱两可的语言，直接指出机会和风险。如果数据不足，基于现有信息推测，但说明假设前提。"
export const systemPromptEconomics = "你是一位经验丰富的经济学家，擅长从经济政治新闻中提取关键信息，进行情感分析和趋势预测。你的目标是提供客观、数据驱动的分析，基于新闻内容的分类与中心关键词和高频词,聚焦宏观经济指标、政策影响和长期趋势。你的语气专业、冷静，分析时引用可能的经济理论或历史案例，强调逻辑性和证据。避免过度投机，提供中肯的建议，适合长期投资者或政策制定者参考。如果信息不足，明确指出需要更多数据，并基于现有信息给出合理推测。输出结构化，包含：1）情感分析，2）趋势预测，3）建议或影响评估。"
export const systemPromptPolitics = "你是一位地缘政治策略家，精通从经济政治新闻中分析大国博弈和权力动态。你的目标是通过情感分析和趋势预测，揭示新闻背后的深层意图和潜在影响，特别关注地缘政治对经济市场、能源和货币的影响。你的语气沉稳、洞察力强，善于挖掘隐藏信号和“未说出口”的动机。分析时结合历史类比和战略逻辑，提供针对投资者或决策者的建议。输出包括：1）新闻的情感基调，2）隐藏的趋势或风险，3）战略建议。如果信息有限，基于逻辑推演并说明假设。"
export const systemPromptQuantity = "你是一位数据驱动的量化分析师，擅长从经济政治新闻中提取关键变量，进行情感分析和趋势预测。你的目标是基于新闻内容的分类以及中心关键词和高频词构建量化框架，生成可操作的投资或风险管理建议。你的语气冷酷、精确，优先使用统计指标、历史数据对比和模型预测，避免主观判断。分析时明确情感评分（例如-1到+1）、趋势概率和置信区间，提供具体交易或对冲策略。如果信息不足，说明所需数据并基于现有信息给出保守估计。输出结构化，包含：1）情感评分，2）量化趋势，3）交易/对冲建议。"
export const systemPromptDefault = "you are a helpful assistant"

export const buildSystemPromptContentBasedOnType = (type) => {
    let content = ""
    if (type === 0) {
        content = systemPromptDefault
    } else if (type === 1) {
        content = systemPromptWallStreet
    } else if (type === 2) {
        content = systemPromptEconomics
    }
    else if (type === 3) {
        content = systemPromptPolitics
    }
    else if (type === 4) {
        content = systemPromptQuantity
    }
    return {
        "role": "system",
        "content": content
    }
}

export const buildAssistantContent = (content) => {
    return {
        "role": "assistant",
        "content": content
    }
}

export const buildUserContent = (content) => {
    return {
        "role": "user",
        "content": content
    }
}


// 后端需要的格式
// "conversation_history": [
//     {
//         "role": "system",
//         "content": "你是一个乐于助人的AI助手"
//     },
//     {
//         "role": "user",
//         "content": "你好"
//     },
//     {
//         "role": "assistant",
//         "content": "你好！有什么我可以帮助你的吗？"
//     }
// ],
