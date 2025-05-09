import json

from flask import Blueprint, request, jsonify, Response

from models import article_to_dict
from services import ChatService, db_delete_all_articles, NewsFetch, db_get_all_articles, keywords_label_count
import logging

from services.news_crud import get_articles_by_headline_and_time
from utils import get_time_now

api_bp = Blueprint('api', __name__, url_prefix='/api')
logger = logging.getLogger(__name__)


@api_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('user_input')
    conversation_history = data.get('conversation_history', [])
    temperature = data.get('temperature')
    max_output_tokens = data.get('max_output_tokens')
    logger.info(f"chat service start: {get_time_now()} \n Query param: {str(data)}")
    if not user_input:
        return jsonify({"error": "user_input is required"}), 400

    params = {}
    if max_output_tokens is not None:
        params["max_output_tokens"] = int(max_output_tokens)

    def generate():
        chat_service = ChatService()
        for chunk in chat_service.handle_user_query(
                user_input=user_input,
                conversation_history=conversation_history,
                **params
        ):
            yield chunk

    return Response(generate(), mimetype='text/event-stream')




@api_bp.route('/news', methods=['GET'])
def get_news_from_db():
    """
    主要获取新闻的接口，加入起始时间，是否头条filter
    :return:
    """
    start_time = request.args.get('start_time')
    is_headline = request.args.get('is_headline')
    page = int(request.args.get('page', 1))  # 默认为第1页
    page_size = int(request.args.get('page_size', 20))  # 默认为每页10条

    logger.info(f"query start: {get_time_now()} \n Query param: {str(request.args)}")
    articles, total = get_articles_by_headline_and_time(start_time, is_headline, page, page_size)
    articles_json = [article_to_dict(article) for article in articles]
    return jsonify({
        'data': articles_json,
        'total': total,
        'page': page,
        'page_size': page_size
    })

@api_bp.route('/data/news-analysis', methods=['POST'])
def articles_analysis():
    data = request.get_json()
    articles = data.get('articles')
    print(articles)
    result = keywords_label_count(articles)
    json_result = json.dumps(result, ensure_ascii=False)
    output = {"type": "json_str", "data": json_result}
    return jsonify(output)


