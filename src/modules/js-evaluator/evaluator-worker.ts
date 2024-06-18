import { JS_SAFE_OBJECTS } from './safe-objects'

restrictGlobalProperties([...JS_SAFE_OBJECTS, 'self', 'postMessage'])

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

onmessage = (e: MessageEvent<EvaluatorWorkerInputMessage>) => {
  const {
    data: { codes, context, contextName }
  } = e

  const errors: string[] = []

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
  contextName = 'cx'
}: {
  code: string
  context: CONTEXT
  contextName?: string
}) {
  Function(contextName, code)(context)
}

function restrictGlobalProperties(safeProperties: string[]) {
  let currentObject = self

  while (currentObject) {
    Object.getOwnPropertyNames(currentObject).forEach((property) => {
      restrictObjectProperty({ target: currentObject, property, safeProperties })
    })

    currentObject = Object.getPrototypeOf(currentObject)
  }
}

function restrictObjectProperty({
  target,
  property,
  safeProperties
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any
  property: string
  safeProperties: string[]
}) {
  if (safeProperties.includes(property)) return

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
