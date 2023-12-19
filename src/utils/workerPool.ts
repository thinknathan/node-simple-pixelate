import { Worker } from "worker_threads";
import * as path from "path";

export class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: { filePath: string; options: Options }[] = [];
  private maxWorkers: number;

  constructor(maxWorkers: number) {
    this.maxWorkers = maxWorkers;
  }

  private createWorker(filePath: string, options: Options): void {
    const worker = new Worker(path.join(__dirname, "processImage.js"), {
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

  private processNextTask(): void {
    const nextTask = this.taskQueue.shift();
    if (nextTask) {
      this.createWorker(nextTask.filePath, nextTask.options);
    }
  }

  public addTask(filePath: string, options: Options): void {
    if (this.workers.length < this.maxWorkers) {
      this.createWorker(filePath, options);
    } else {
      this.taskQueue.push({ filePath, options });
    }
  }

  public waitForCompletion(): void {
    this.workers.forEach((worker) => {
      worker.on("exit", () => {
        this.processNextTask();
      });
    });
  }
}
