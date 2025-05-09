from flask import Blueprint, send_from_directory
import logging

frontend_bp = Blueprint('frontend', __name__)
logger = logging.getLogger(__name__)

# 前端应用节点
@frontend_bp.route('/')
def serve_index():
    logger.info('App Start')
    return send_from_directory('static', 'index.html')

@frontend_bp.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)