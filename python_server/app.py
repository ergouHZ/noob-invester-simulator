from datetime import datetime, timedelta

from flask import Flask, Blueprint
from flask_apscheduler import APScheduler
from flask_cors import CORS
import logging

from config import Config
from models.models import db
from routes.api import api_bp
from routes.frontend import frontend_bp
from services import NewsFetch
from utils import get_time_n_days_earlier

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # 允许前端访问
app.config.from_object(Config)

# 配置日志
logging.basicConfig(
    level=logging.INFO,  # 设置日志级别：DEBUG, INFO, WARNING, ERROR, CRITICAL
    format='%(asctime)s [%(levelname)s] %(message)s',  # 日志格式
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

logger = logging.getLogger(__name__)

# 使用Bluprint为控制器加前缀
app.register_blueprint(frontend_bp)
app.register_blueprint(api_bp)

db.init_app(app)
with app.app_context():
    db.create_all()
    news_fetch = NewsFetch()
    news_fetch.get_last_hour_news(
        get_time_n_days_earlier(30),
        get_time_n_days_earlier(2),
        5
    )

scheduler = APScheduler()
scheduler.init_app(app)


# 每小时定时任务，这里每小时只抓取头最新头条，everything每天运行一次（实测如果只限定一小时数据量不够）
def scheduler_headlines_fetch_hourly():
    print("每小时抓取头条！执行！")
    with app.app_context():
        news_fetch = NewsFetch()
        news_fetch.get_top_headlines()


def scheduler_everything_news_fetch_daily():
    print("每24小时抓取所有新闻！执行！")
    with app.app_context():
        news_fetch = NewsFetch()
        news_fetch.get_last_hour_news(
            get_time_n_days_earlier(2),
            get_time_n_days_earlier(1),

        )


# 添加每小时执行的任务
scheduler.add_job(
    id='Hourly Job',
    func=scheduler_headlines_fetch_hourly,
    trigger='interval',
    hours=1,
    start_date=datetime.now() + timedelta(seconds=20)  # 确保应用执行后程序运行
)
scheduler.add_job(
    id='Daily Job',
    func=scheduler_everything_news_fetch_daily,
    trigger='interval',
    hours=24,
    start_date=datetime.now() + timedelta(seconds=30)  # 确保应用执行后程序运行
)

if __name__ == '__main__':
    scheduler.start()
    app.run()
