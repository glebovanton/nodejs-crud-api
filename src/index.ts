import * as process from 'node:process';
import * as http from 'node:http';
import 'dotenv/config'
import { userRequestListener } from './routes';
import { startCluster } from './cluster';

const { PORT = 3000 } = process.env;

function startServer(): void {
  http
      .createServer(userRequestListener)
      .listen(PORT, () => console.log(`Server running on port ${PORT} & PID: ${process.pid}. API on http://localhost:${PORT}`));
}

startCluster(startServer);
