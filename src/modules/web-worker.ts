/**
 * Инициализирует Web Worker
 * @param path - путь до файла Web Worker
 */
export function initWebWorker(path: string) {
  const worker = new Worker(path, { type: 'module' })

  return {
    post: <MESSAGE = unknown, RESULT = unknown>(message: MESSAGE): Promise<RESULT> => {
      return new Promise((resolve) => {
        worker.onmessage = ({ data }: MessageEvent<RESULT>) => {
          resolve(data)
        }

        worker.postMessage(message)
      })
    },
    terminate: () => worker.terminate()
  }
}
