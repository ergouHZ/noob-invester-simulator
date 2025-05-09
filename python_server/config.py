import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    #DEBUG = True

    # 在这里统一用环境变量读取key
    MY_OPENAI_API_KEY = os.getenv("MY_OPENAI_API_KEY")

    #https://newsapi.org/
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")

    # OpenAI配置  (默认4.1 nano比较省钱 = =)
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gpt-4.1-nano")
    DEFAULT_MAX_TOKENS = int(os.getenv("DEFAULT_MAX_TOKENS", "1024"))

    # 定时器
    SCHEDULER_API_ENABLED = True

    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
