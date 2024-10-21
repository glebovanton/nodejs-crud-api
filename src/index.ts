import * as http from 'node:http';
import 'dotenv/config'
import { userRequestListener } from './routes';
import { startCluster } from './cluster';

const { PORT = 3000 } = process.env;

const server = http.createServer(userRequestListener);

function startServer(): void {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} & PID: ${process.pid}. API on http://localhost:${PORT}`);
  });
}

function shutdown() {
  server.close((err) => {
    if (err) {
      console.error('Error while closing the server:', err);
      process.exit(1);
    }
    console.log('Server closed successfully');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTSTP', shutdown);
process.on('SIGTERM', shutdown);
startCluster(startServer);

export { server, startServer };
