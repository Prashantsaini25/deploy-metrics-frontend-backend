from fastapi import FastAPI
import time
import random

app = FastAPI()

start_time = time.time()
request_counter = 0


@app.get("/metrics")
def get_metrics():
    global request_counter
    request_counter += 1

    return {
        "cpu_usage_percent": round(random.uniform(10, 90), 2),
        "latency_ms": round(random.uniform(50, 500), 2),
        "memory_usage_mb": round(random.uniform(100, 1024), 2),
        "request_count": request_counter,
        "timestamp": time.time()
    }
