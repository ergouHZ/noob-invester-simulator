from datetime import datetime, timedelta
from flask import Flask
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
app.config.from_object(Config)

# ==================== 生产环境安全配置 ====================

# 1. CORS配置（根据实际前端域名调整）
PRODUCTION_DOMAINS = [
    "https://dendi.top",
    "https:///noob-investor.dendi.top",
    "https:///noob-investor.dendi.top/app"
]

CORS(app,
     origins=PRODUCTION_DOMAINS,
     methods=["GET", "POST"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     expose_headers=["Content-Length", "X-Total-Count"],
     max_age=86400
     )


# 2. 安全HTTP头中间件
@app.after_request
def add_security_headers(response):
    # 基础安全头
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

    return response


# 3. 会话安全配置（如果使用Flask会话）
app.config.update(
    SESSION_COOKIE_SECURE=True,  # 仅HTTPS传输
    SESSION_COOKIE_HTTPONLY=True,  # 防止XSS访问cookie
    SESSION_COOKIE_SAMESITE='Lax',  # CSRF保护
    PERMANENT_SESSION_LIFETIME=timedelta(hours=1)  # 会话过期时间
)

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
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


# 每小时定时任务，这里每小时只抓取头最新头条，everything每天运行一次（实测如果只限定一小时数据量不够）
def scheduler_headlines_fetch_hourly():
    logger.info("每小时抓取头条！执行！")
    with app.app_context():
        news_fetch_2 = NewsFetch()
        news_fetch_2.get_top_headlines()


def scheduler_everything_news_fetch_daily():
    logger.info("每24小时抓取所有新闻！执行！")
    with app.app_context():
        news_fetch_1 = NewsFetch()
        news_fetch_1.get_last_hour_news(
            get_time_n_days_earlier(2),
            get_time_n_days_earlier(1),
        )

scheduler = APScheduler()
scheduler.init_app(app)

# 模块级变量，限制调度器启动
SCHEDULER_STARTED = False
def on_starting():
    global scheduler
    global SCHEDULER_STARTED

    if not SCHEDULER_STARTED:
        # 标记调度器已启动
        SCHEDULER_STARTED = True
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
        scheduler.start()

# debug状态下执行，生产环境下使用gunicorn
if __name__ == '__main__':
    on_starting()
    app.run()
