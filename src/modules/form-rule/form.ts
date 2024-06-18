export interface FormRuleModel {
  code?: string
  propertyCodes: string[]
}

export function initRuleForm(): FormRuleModel {
  return { propertyCodes: [] }
}
