const isProd = process.env.NODE_ENV === 'production'

const colors = {
  reset: '\x1b[0m',
  info: '\x1b[36m', // Cyan
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[35m', // Magenta
  socket: '\x1b[32m', // Green
}

function getTimestamp() {
  return new Date().toISOString()
}

export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`${colors.info}[${getTimestamp()}] [INFO]${colors.reset} ${message}`, ...meta)
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`${colors.warn}[${getTimestamp()}] [WARN]${colors.reset} ${message}`, ...meta)
  },
  error: (message: string, ...meta: any[]) => {
    console.error(`${colors.error}[${getTimestamp()}] [ERROR]${colors.reset} ${message}`, ...meta)
  },
  debug: (message: string, ...meta: any[]) => {
    if (!isProd) {
      console.log(`${colors.debug}[${getTimestamp()}] [DEBUG]${colors.reset} ${message}`, ...meta)
    }
  },
  socket: (message: string, ...meta: any[]) => {
    console.log(`${colors.socket}[${getTimestamp()}] [SOCKET]${colors.reset} ${message}`, ...meta)
  }
}
