import { initWebWorker } from '../web-worker'
import type { EvaluatorWorkerInputMessage, EvaluatorWorkerOutputMessage } from './evaluator-worker'

export function initJsCodeEvaluator() {
  const worker = initWebWorker(new URL('./evaluator-worker.ts', import.meta.url).toString())

  return {
    evaluate: async (parameters: EvaluatorWorkerInputMessage) => {
      const result = await worker.post<EvaluatorWorkerInputMessage, EvaluatorWorkerOutputMessage>(
        parameters
      )

      return result
    },
    terminate: worker.terminate
  }
}
