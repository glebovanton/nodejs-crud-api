import cluster from 'node:cluster';
import * as http from 'node:http';
import 'dotenv/config'
import { userRequestListener } from './routes';
import { startCluster } from './cluster';

const { HOST = 'localhost', PORT = 3000 } = process.env;

let server: http.Server;

function startServer(port: number): void {
  server = http.createServer(userRequestListener);
  server.listen(port, () => {
    console.log(`Server running on port ${port} & PID: ${process.pid}. API on http://${HOST}:${port}/api/users/`);
  });

  function shutdown() {
    server.close((err) => {
      if (err) {
        console.error('Error while closing the server:', err);
        process.exit(1);
      }
      console.log('Server closed successfully');

      if (cluster.workers) {
        for (const id in cluster.workers) {
          cluster.workers[id]?.kill();
        }
      }

      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTSTP', shutdown);
  process.on('SIGTERM', shutdown);
}

startCluster(() => {
  const workerPort = Number(PORT) + (cluster.worker?.id || 0);
  startServer(workerPort);
});

export const getServer = () => server;

export { server, startServer };
