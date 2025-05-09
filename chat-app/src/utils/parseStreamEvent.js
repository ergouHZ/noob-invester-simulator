export default function parseStreamEvent(chunkStr) {
    const rawEvents = chunkStr.split('\n').filter(Boolean); // 过滤掉空行

    const events = rawEvents.map(line => {
        try {
            return JSON.parse(line);
        } catch (e) {
            console.error('解析失败:', line, e);
            return null; // 或自定义处理
        }
    }).filter(Boolean);

    return events;
}