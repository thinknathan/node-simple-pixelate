"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = void 0;
const worker_threads_1 = require("worker_threads");
const path = require("path");
class WorkerPool {
    constructor(maxWorkers) {
        this.workers = [];
        this.taskQueue = [];
        this.maxWorkers = maxWorkers;
    }
    createWorker(filePath, options) {
        const worker = new worker_threads_1.Worker(path.join(__dirname, "processImage.js"), {
            workerData: { filePath, options },
        });
        // Listen for messages and errors from the worker
        worker.on("message", (message) => {
            console.log(message);
            this.processNextTask();
        });
        worker.on("error", (err) => {
            console.error(`Error in worker for file ${filePath}:`, err);
            this.processNextTask();
        });
        this.workers.push(worker);
    }
    processNextTask() {
        const nextTask = this.taskQueue.shift();
        if (nextTask) {
            this.createWorker(nextTask.filePath, nextTask.options);
        }
    }
    addTask(filePath, options) {
        if (this.workers.length < this.maxWorkers) {
            this.createWorker(filePath, options);
        }
        else {
            this.taskQueue.push({ filePath, options });
        }
    }
    waitForCompletion() {
        this.workers.forEach((worker) => {
            worker.on("exit", () => {
                this.processNextTask();
            });
        });
    }
}
exports.WorkerPool = WorkerPool;
