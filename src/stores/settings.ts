import type { FormRuleModel } from '@/modules/form-rule'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const rules = ref<FormRuleModel[]>([])

  return { rules }
})
