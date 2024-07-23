import { JS_SAFE_OBJECTS } from './safe-objects'

export interface EvaluatorWorkerInputMessage<CONTEXT = unknown> {
  /** Набор кодов для выполнения */
  codes: string[]
  /** Контекст для передачи в исполняемый код */
  context: CONTEXT
  /** Название контекста */
  contextName?: string
}

interface EvaluatorWorkerOutputErrorMessage {
  status: 'error'
  /** Список ошибок */
  errors: string[]
}
interface EvaluatorWorkerOutputSuccessMessage {
  status: 'success'
  /** Результат выполнения */
  result: unknown
}
export type EvaluatorWorkerOutputMessage =
  | EvaluatorWorkerOutputSuccessMessage
  | EvaluatorWorkerOutputErrorMessage

onmessage = async (e: MessageEvent<EvaluatorWorkerInputMessage>) => {
  const {
    data: { codes, context, contextName }
  } = e

  const errors: string[] = []

  restrictGlobalProperties([...JS_SAFE_OBJECTS, 'self', 'postMessage'])
  codes.forEach((code) => {
    try {
      executeCode({ code, context, contextName })
    } catch (e) {
      errors.push((e as Error).message)
    }
  })

  const outputMessage: EvaluatorWorkerOutputMessage = errors.length
    ? {
        status: 'error',
        errors
      }
    : { status: 'success', result: context }

  postMessage(outputMessage)
}

function executeCode<CONTEXT>({
  code,
  context,
  contextName = 'cx',
  deps
}: {
  code: string
  context: CONTEXT
  contextName?: string
  deps?: Record<string, unknown>
}) {
  Function(contextName, ...Object.keys(deps ?? {}), code)(context, ...Object.values(deps ?? {}))
}

function restrictGlobalProperties(safeProperties: string[]) {
  let currentObject = self

  while (currentObject) {
    Object.getOwnPropertyNames(currentObject).forEach((property) => {
      if (safeProperties.includes(property)) return
      restrictObjectProperty({ target: currentObject, property })
    })

    currentObject = Object.getPrototypeOf(currentObject)
  }
}

function restrictObjectProperty({ target, property }: { target: any; property: string }) {
  const descriptor = Object.getOwnPropertyDescriptor(target, property)
  if (!descriptor) {
    if (typeof target[property] === 'function') {
      target[property] = () => throwSecurityError(property)
    } else {
      delete target[property]
    }
    return
  }

  if (!descriptor.configurable) return

  Object.defineProperty(target, property, {
    get: () => throwSecurityError(property),
    configurable: false
  })
}

function throwSecurityError(property: string) {
  throw new Error(`Security Exception: cannot access ${property}`)
}
