import logging
from operator import and_

from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from models import NewsArticle, clean_article
from models.models import db
from utils.time_utils import formatted_time_1_is_earlier_than_2

logger = logging.getLogger(__name__)


def db_add_multiple_articles(articles,is_headline = True):
    """
    一次存入多个文章
    :param is_headline: 是否存入头条文章
    :param articles:
    :return:
    """
    if not articles:
        return True, "No articles to save"
    session = db.session()

    try:
        with session.begin():
            db_articles_to_add = []
            for article in articles:
                cleaned = clean_article(article, is_headline)
                title = cleaned.get('title')
                # 检查数据库中是否存在相同标题
                exists = session.query(NewsArticle).filter_by(title=title).first()
                if exists:
                    continue
                # 如果不存在，则加入待插入列表
                db_articles_to_add.append(NewsArticle(**cleaned))
            # 批量插入
            session.add_all(db_articles_to_add)
        logger.info(f"成功保存了 {len(db_articles_to_add)} 篇文章")
        return True, "Successfully saved articles"
    except IntegrityError:
        session.rollback()
        logger.warning("Some articles were skipped due to duplicate titles.")
        return False, "Some articles were skipped because they already exist."
    except SQLAlchemyError as e:
        session.rollback()
        logger.error(f"数据库错误：{str(e)}")
        return False, f"Database error: {str(e)}"
    except Exception as e:
        session.rollback()
        return False, f"Unexpected error: {str(e)}"


def db_get_all_articles():
    articles = NewsArticle.query.all()
    count = len(articles)
    logger.info(f"News query number: ,{str(count)}")
    return articles


def get_articles_by_title(keyword):
    """
    关键词查询
    :param keyword:
    :return:
    """
    return NewsArticle.query.filter(NewsArticle.title.like(f"%{keyword}%")).all()

def get_articles_by_headline_and_time(start_time,is_headline,page,page_size,keyword=None):
    """
    根据是否头条和起始时间获取文章，前端获取文章的主要接口（带分页）
    :param keyword:
    :param page_size:
    :param page:
    :param start_time:string
    :param is_headline:若参数为真则获取头条
    :return:
    """
    # 处理 is_headline
    if isinstance(is_headline, str):
        headline = is_headline.lower() == "true"
    else:
        headline = bool(is_headline)

    query = NewsArticle.query.filter(
        and_(
            NewsArticle.headline == headline,
            NewsArticle.publishedAt > start_time
        )
    )

    # 如果加入了keyword关键词
    if keyword:
        keyword_filter = or_(
            NewsArticle.title.ilike(f'%{keyword}%'),
            NewsArticle.content.ilike(f'%{keyword}%')
        )
        query = query.filter(keyword_filter)

    total = query.count()

    # 在数据库层面分页和排序
    articles = query\
        .offset((page - 1) * page_size) \
        .limit(page_size) \
        .all()

    return articles, total

def get_article_by_id(article_id):
    return NewsArticle.query.get(article_id)


def db_delete_all_articles():
    num_rows_deleted = NewsArticle.query.delete()
    db.session.commit()
    return num_rows_deleted
