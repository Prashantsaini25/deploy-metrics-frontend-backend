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
    uptime = int(time.time() - start_time)
    cpu = round(random.uniform(10, 90), 2)
    latency = round(random.uniform(100, 300), 2)
    return {
        "uptime_seconds": uptime,
        "cpu_percent": cpu,
        "latency_ms": latency,
        "request_counter": request_counter
    }
