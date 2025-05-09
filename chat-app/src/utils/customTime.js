export function formatDateToDtFormat(date) {
    // 获取对应后端格式的时间
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

//获取天数加小时数前
//使用的时候比如说想获取前一个小时的新闻，需要获取1天+1h,因为免费的新闻api有24小时的delay
export function getTimestampDaysAndHoursAgo(days,hours) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - days);
    date.setUTCHours(date.getUTCHours() - hours);
    return formatDateToDtFormat(date);
}