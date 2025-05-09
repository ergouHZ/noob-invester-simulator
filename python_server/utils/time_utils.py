from datetime import datetime, timedelta

# 获取当前时间
now = datetime.now()


def get_time_now():
    """
    获取 'YYYY-MM-DDTHH:MM:SS' 格式的时间
    :return:
    """
    formatted_time = now.strftime('%Y-%m-%dT%H:%M:%S')
    return formatted_time


def get_time_n_days_earlier(n):
    """
    免费的api时间有延迟，延迟一天，因此只能获取前一天新闻，这个方法获取n天的时间
    :return:
    """
    minus_one_hour = now - timedelta(days=n)
    formatted_time = minus_one_hour.strftime('%Y-%m-%dT%H:%M:%S')
    print(formatted_time)
    return formatted_time


def formatted_time_1_is_earlier_than_2 (formatted_time_1,formatted_time_2):
    """
    比较两个时间戳，如果前者更早，返回真
    :param formatted_time_2:
    :param formatted_time_1:
    :return:
    """
    dt_format = '%Y-%m-%dT%H:%M:%SZ'
    print(formatted_time_1)
    print(formatted_time_2)
    dt_1 = datetime.strptime(formatted_time_1, dt_format)
    dt_2 = datetime.strptime(formatted_time_2, dt_format)
    return dt_1 < dt_2
