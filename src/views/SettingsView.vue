<template>
  <ViewLayout title="Настройки">
    <NGrid :cols="1" :y-gap="10">
      <NGi>
        <NDynamicInput v-model:value="rules" :on-create="handleCreate">
          <template #create-button-default> Добавить правило </template>
          <template #default="{ value }">
            <CodeEditor v-model="value.code" :eslint-config="eslintConfig" :scope="{ cx }" />
          </template>
        </NDynamicInput>
      </NGi>

      <NGi>
        <NButton type="primary" @click="handleSave">Сохранить</NButton>
      </NGi>
    </NGrid>
  </ViewLayout>
</template>

<script setup lang="ts">
import { CodeEditor } from '@/modules/code-editor'
import { initRuleForm, type FormRuleModel } from '@/modules/form-rule'
import { analyzeFormRuleCode } from '@/modules/form-rule/code-analyze'
import { useSettingsStore } from '@/stores/settings'
import { NButton, NDynamicInput, NGi, NGrid } from 'naive-ui'
import { ref } from 'vue'
import ViewLayout from './ViewLayout.vue'
import { initForm } from '@/modules/form'
import { JS_DANGEROUS_OBJECTS } from '@/modules/js-evaluator/safe-objects'

const settingsStore = useSettingsStore()

const rules = ref(settingsStore.rules)
const cx = initForm()

const eslintConfig = {
  env: { worker: true },
  globals: {
    cx: 'readonly'
  },
  rules: {
    'no-restricted-globals': ['error', ...JS_DANGEROUS_OBJECTS],
    'no-undef': ['error']
  }
}

function handleCreate() {
  return initRuleForm()
}

function handleSave() {
  const filledRules = rules.value.filter(({ code }) => !!code) as Required<FormRuleModel>[]
  const analyzedRules: FormRuleModel[] = filledRules.map((rule) => {
    const { usedPropertyCodes, assignedPropertyCodes } = analyzeFormRuleCode(rule.code)

    const onlyUsedPropertyCodes = usedPropertyCodes.filter(
      (usedPropertyCode) => !assignedPropertyCodes.includes(usedPropertyCode)
    )
    return { code: rule.code, propertyCodes: onlyUsedPropertyCodes }
  })

  settingsStore.rules = JSON.parse(JSON.stringify(analyzedRules))
}
</script>

<style scoped></style>
