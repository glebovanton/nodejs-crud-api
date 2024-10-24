import * as http from 'node:http';
import { ClientRequest } from 'node:http';
import cluster from 'node:cluster';
import { Worker } from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import { StatusCode } from 'status-code-enum';

const { HOST = 'localhost', MULTI = 'false', PORT = 4000 } = process.env;

export const startCluster = (cb: () => void) => {
  if (MULTI === 'true') {
    if (cluster.isPrimary) {
      const cpusCount: number = availableParallelism() - 1;
      const workers: Worker[] = [];

      for (let i = 0; i < cpusCount; i++) {
        const worker: Worker = cluster.fork();
        workers.push(worker);
      }

      let currentWorkerIndex = 0;

      const loadBalancer = http.createServer((req, res) => {
        const workerPort: number = Number(PORT) + currentWorkerIndex + 1;

        const options = {
          hostname: HOST,
          port: workerPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        const proxyReq: ClientRequest = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || StatusCode.ServerErrorInternal, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });

        currentWorkerIndex = (currentWorkerIndex + 1) % workers.length;
      });

      loadBalancer.listen(Number(PORT), () => {
        console.log(`Load balancer running on port ${PORT}`);
      });

      function shutdown() {
        workers?.forEach(worker => worker.kill());
        process.exit(0);
      }

      process.on('SIGINT', shutdown);
      process.on('SIGTSTP', shutdown);
      process.on('SIGTERM', shutdown);
    } else {
      cb();
    }
  } else {
    cb();
  }
};
