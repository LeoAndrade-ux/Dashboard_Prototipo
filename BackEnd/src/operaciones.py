# Supongamos que recibimos un JSON con una lista de documentos como 'data'
def conteo_brechas(data):
    model_counts = {}
    result_json = {}
    for doc in data:
        breach_time = doc['breach_time']
        model_name = doc['model_name']

        if breach_time not in model_counts:
            model_counts[breach_time] = {}

        if model_name not in model_counts[breach_time]:
            model_counts[breach_time][model_name] = 0

        model_counts[breach_time][model_name] += 1

    for breach_time, counts in model_counts.items():
        result_json[breach_time] = {model_name: count for model_name, count in counts.items()}

    return result_json



