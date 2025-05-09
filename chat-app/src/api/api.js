import { sanitizeArticles } from "@/utils/sanitizeArticles";

const BASE_URL = process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : 'http://127.0.0.1:5000';

export async function fetchNewsByFilters(start_time, is_headline, page, page_size, keyword) {
    const params = new URLSearchParams();
    params.append('start_time', start_time);
    params.append('is_headline', is_headline);
    params.append('page', page);
    params.append('page_size', page_size);
    if (keyword) {
        params.append('keyword', keyword);
    }

    const response = await fetch(`${BASE_URL}/api/news?${params.toString()}`, {
        method: 'GET',
    });
    const result = await response.json();
    
    return result;
}

///调用后端方法聚合文本
export async function fetchLabelAnalysisKeywords(articles) {
    
    const cleanedArticles = sanitizeArticles(articles)
    const reqBody = {
        articles: cleanedArticles
    };

    const response = await fetch(`${BASE_URL}/api/data/news-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
    });
    
    const result = await response.json();
    return result.data;
}

