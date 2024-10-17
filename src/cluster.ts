import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const { MULTI = false } = process.env;

export const startCluster = (cb: () => void) => {
  if (MULTI === 'true') {
    if (cluster.isPrimary) {
      const cpusCount: number = availableParallelism() - 1;
      for (let i = 0; i < cpusCount; i++) {
        const worker = cluster.fork();
        worker.on('exit', () => {
          console.log(`Worker is died. PID: ${worker.process.pid}.`);
          cluster.fork()
        })
      }
    }

    if (cluster.isWorker) {
      cb();
    }
  } else {
    cb();
  }
}
