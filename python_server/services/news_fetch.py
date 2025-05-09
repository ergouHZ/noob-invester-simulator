import logging

from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException

from config import Config
from services.news_crud import db_add_multiple_articles

logger = logging.getLogger(__name__)


class NewsFetch:
    def __init__(self):
        self.news_client = NewsApiClient(api_key=Config.NEWS_API_KEY)

    def get_top_headlines(
            self,
            category= 'business'

    ):
        """
        获取最新的头条，并存储
        :param category:
        :return:
        """
        try:
            top_headlines = self.news_client.get_top_headlines(
                category = category,
                language='en',
                page_size=100,
            )
            logger.info(f"Get top headlines, status: {top_headlines['status']}, Total results: {top_headlines['totalResults']}")
            articles = top_headlines['articles']
            db_add_multiple_articles(articles,True)
            return articles
        except NewsAPIException as e:
            logger.error(f"status: {e.get_status()}, message: {e.get_message()}")

    # 获取所有资讯
    # 按理来说开发者app只能获取第1页的100条结果，但是这样设置，有时可以读取总数的结果，有时会返回达到读取上限
    def get_last_hour_news(
            self,
            start_time,
            end_time,
            page_total=5,
            keyword = 'business OR financial OR finance OR political OR currency',
            lang='en',
    ):
        """
        获取前一个小时所有资讯并存储，默认一次请求获取5页数据
        :param page_total: 我需要获取的总页数，因为每次只能请求100个数量
        :param end_time:
        :param start_time:
        :param keyword:
        :param lang:
        :return:
        """
        page = 1
        all_articles = []

        try:
            while page <= page_total:
                response = self.news_client.get_everything(
                    q=keyword,
                    from_param=start_time,
                    to=end_time,
                    language=lang,
                    sort_by='relevancy',
                    page=page,
                )
                articles = response['articles']
                total_results = response['totalResults']
                if not articles:
                    break
                all_articles.extend(articles)
                page += 1
                if len(all_articles) >= total_results:
                    break

            logger.info(
                f"Get everything news, Total results: {len(all_articles)}")

            db_add_multiple_articles(all_articles, False)
            return all_articles

        except NewsAPIException as e:
            logger.error(f"status: {e.get_status()}, message: {e.get_message()}")

