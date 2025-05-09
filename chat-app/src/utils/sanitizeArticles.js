export function sanitizeArticles(articles) {
  // 用正则表达式过滤HTML标签
  function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  return articles.map(article => ({
    content: article.content ? stripHtml(article.content) : '',
    title: article.title ? stripHtml(article.title) : '',
    description: article.description ? stripHtml(article.description) : '',
  }));
}