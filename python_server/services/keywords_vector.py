from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from collections import Counter

import nltk

from routes.frontend import logger
from utils.word_clean import clean_text

# 停用词直接从库中获取，过滤无意义词
nltk.download('stopwords')
stop_words = list(stopwords.words('english'))

# 同时过滤h5元素，有时文本内容会返回h5 tag
stop_words.append('li')
stop_words.append('ul')
stop_words.append('chars')

def keywords_label_count(articles):
    """
    使用KMeans对文章进行分类，并提取关键词
    :param articles: 数据库里的文章
    :return:
    """
    texts = []
    for article in articles:
        combined_text = ''
        if article['title']:
            combined_text += article['title'] + ' '
        if article['content']:
            combined_text += article['content'] + ' '
        if article['description']:
            combined_text += article['description'] + ' '
        texts.append(clean_text(combined_text))

    # 使用TF-IDF向量化，指定停用词
    vectorizer = TfidfVectorizer(stop_words=stop_words, ngram_range=(1, 2))
    X = vectorizer.fit_transform(texts)

    # 分类的数量
    k = 10
    if len(articles) >=100:
        k=10
    elif len(articles) <=50:
        k=4
    else:
        k = int(len(articles)/12)
    print(k)

    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)

    labels = kmeans.labels_
    count = Counter(labels)
    cluster_info = get_meaningful_cluster_labels(vectorizer, kmeans, texts, labels)
    result = {}
    for cluster, info in cluster_info.items():
        result[cluster] = {
            "frequency": count[int(cluster.split('_')[1])],
            "center_keywords": info["center_keywords"],
            "frequent_keywords": info["frequent_keywords"],
            "sample_texts": info["sample_texts"]
        }

    return result



def get_meaningful_cluster_labels(vectorizer, kmeans, texts, labels, n_words=8):
    feature_names = vectorizer.get_feature_names_out()
    cluster_centers = kmeans.cluster_centers_
    cluster_info = {}
    for cluster_id in set(labels):
        # 方法1：从聚类中心取词
        top_indices = cluster_centers[cluster_id].argsort()[-n_words:][::-1]
        center_words = [feature_names[idx] for idx in top_indices]

        # 方法2：从簇内文本中找高频词，过滤掉停用词
        cluster_texts = [texts[i] for i in range(len(texts)) if labels[i] == cluster_id]
        all_words = ' '.join(cluster_texts).split()

        # 过滤停用词
        filtered_words = [w for w in all_words if w.isalpha() and w not in stop_words]
        freq_words = [word for word, _ in Counter(filtered_words).most_common(5)]

        sample_texts = cluster_texts[:1]
        cluster_info[f"文章类别_{cluster_id}"] = {
            "center_keywords": center_words,
            "frequent_keywords": freq_words,
            "sample_texts": sample_texts
        }
    return cluster_info
