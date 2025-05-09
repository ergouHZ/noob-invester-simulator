from typing import Generator, List, Dict
from clients.openai_client import OpenAIClient


def _build_messages(
        user_input: str,
        conversation_history: List[Dict]
) -> List[Dict]:
    """构建OpenAI格式的消息列表
    :param:
        user_input: 用户输入文本
        conversation_history: 历史对话记录，从前端传回
    :return:
        符合openai格式的传输Input
    """
    messages = []

    # 添加系统消息(如果有)
    if conversation_history and conversation_history[0].get("role") == "system":
        messages.append(conversation_history[0])

    # 添加历史对话(节省成本)
    max_history = 5
    for msg in conversation_history[-max_history:]:
        if msg["role"] in ["user", "assistant"]:
            messages.append(msg)

    messages.append({"role": "user", "content": user_input})
    return messages



class ChatService:
    def __init__(self, openai_client: OpenAIClient = None):
        self.openai_client = openai_client or OpenAIClient()

    def handle_user_query(
            self,
            user_input: str,
            conversation_history: List[Dict] = None,
            **ai_param_args
    ) -> Generator[str, None, None]:
        """
        主要与OPENAI流式交互的业务
        :param user_input: 用户最新输入
        :param conversation_history: 前端返还的历史信息数组
        :param ai_param_args: 前端传的ai模型参数
        :return: 流形式返回结果
        """

        messages = _build_messages(user_input, conversation_history or [])
        return self.openai_client.chat_stream(messages=messages, **ai_param_args)
