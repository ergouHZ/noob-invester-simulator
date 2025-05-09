from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def clean_article(article, is_headline):
    """
    api传回的数据中有不需要的attr,不需要 过滤掉，同时设置是否为头条
    :param is_headline: 是否通过头条api获取的，默认为真
    :param article:
    :return:
    """
    article = dict(article)
    if 'source' in article and 'name' in article['source']:
        article['source'] = article['source']['name']
    if 'author' in article:
        del article['author']
    article['headline'] = is_headline
    return article


def article_to_dict(article):
    return {
        'id': article.id,
        'title': article.title,
        'description': article.description,
        'url': article.url,
        'urlToImage': article.urlToImage,
        'publishedAt': article.publishedAt,
        'source': article.source,
        'content': article.content,
        'is_headline': article.headline
    }


class NewsArticle(db.Model):
    __tablename__ = 'news_articles'  # 可选：指定表名
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(500), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(255), nullable=False)
    urlToImage = db.Column(db.String(255), nullable=True)
    publishedAt = db.Column(db.String(50), nullable=True)
    source = db.Column(db.String(100), nullable=True)
    headline = db.Column(db.Boolean, default=True, nullable=True)  # 是否为头条
    content = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f"<NewsArticle {self.title}>"
