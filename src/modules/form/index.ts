import type { FormRuleModel } from '../form-rule'
import { initJsCodeEvaluator } from '../js-evaluator'

export interface FormModel {
  firstName?: string
  lastName?: string
  middleName?: string
  fullname?: string
  email?: string
  kksCode?: string
  kksInstallation?: string
  kksSystemCode?: string
  kksSystem?: string
  kksSystemNumber?: string
  kksUnit?: string
  kksUnitNumber?: string
}

export function initForm(): FormModel {
  return {}
}

function isFormModel(value: unknown): value is FormModel {
  return true
}

export function initFormRulesEvaluator() {
  const { evaluate: evaluateJsCode, terminate } = initJsCodeEvaluator()

  return {
    evaluate: async (form: FormModel, rules: FormRuleModel[]) => {
      const codes = rules.map(({ code }) => code).filter(Boolean) as string[]
      const output = await evaluateJsCode({ context: form, codes })
      if (output.status === 'error') {
        output.errors.forEach(console.error)
        return form
      }
      if (!isFormModel(output.result)) return form
      return output.result
    },
    terminate
  }
}
