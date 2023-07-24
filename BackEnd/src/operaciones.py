from collections import defaultdict

def conteo_brechas(data):
    model_counts = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    result_json = {}

    for doc in data:
        breach_time = doc['breach_time']
        model_name = doc['model_name']
        ip = doc['ip']

        # Contar elementos repetidos por IP y fecha
        model_counts[ip][breach_time][model_name] += 1

    # Construir el JSON resultado con el formato deseado
    for ip, dates in model_counts.items():
        for breach_time, counts in dates.items():
            result_json.setdefault(breach_time, {})[ip] = counts

    return result_json
