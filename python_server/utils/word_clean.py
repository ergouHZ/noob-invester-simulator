import re

def clean_text(text):
    """
    小写，去除特殊字符
    :param text:
    :return:
    """
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    return text