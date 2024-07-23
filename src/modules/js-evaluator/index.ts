import { initWebWorker } from '../web-worker'
import type { EvaluatorWorkerInputMessage, EvaluatorWorkerOutputMessage } from './evaluator-worker'

export function initJsCodeEvaluator() {
  const worker = initWebWorker(new URL('./evaluator-worker.ts', import.meta.url).toString())

  return {
    evaluate: worker.post<EvaluatorWorkerInputMessage, EvaluatorWorkerOutputMessage>,
    terminate: worker.terminate
  }
}
