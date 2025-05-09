import json
import logging

from flask import jsonify
from openai import OpenAI
from typing import Generator, Dict, Any
from config import Config
from utils import get_time_now

logger = logging.getLogger(__name__)

class OpenAIClient:
    def __init__(self, api_key: str = None):
        """
        构建需要的参数和key
        :param api_key:
        """
        self.client = OpenAI(api_key=api_key or Config.MY_OPENAI_API_KEY)
        self.default_params = {
            "model": Config.DEFAULT_MODEL,
            "max_output_tokens":1024,
            "stream": True
        }

    def chat_stream(
            self,
            messages: list,
            **override_params
    ) -> Generator[str, None, None]:
        """
        :param messages: 对话消息列表
        :param override_params: 覆盖默认参数的参数
        :return: 流式返回的文本块
        """

        params = {
            **self.default_params,
            **override_params,
            "input": messages
        }
        try:
            stream = self.client.responses.create(**params)
            for event in stream:
                if event.type == 'response.output_text.delta':
                    #流式片段
                    # 后端预处理格式，经测试如果不在python处理，在js里处理会很繁琐
                    output = {"type": "delta", "text": event.delta}
                    yield json.dumps(output)+"\n"
                elif event.type == 'response.output_text.done':
                    output = {"type": "done", "text": event.text}
                    logger.info(f"AI stream complete: {get_time_now()}")
                    yield json.dumps(output)+"\n"
                elif event.type == 'response.completed':
                    # 流式完成
                    pass
        except Exception as e:
            yield f"[ERROR] {str(e)}"