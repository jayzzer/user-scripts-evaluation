<template>
  <ViewLayout title="Форма">
    <NForm @change="handleChange">
      <NFormItem label="Фамилия (lastName)" :label-props="{ for: 'lastName' }">
        <NInput
          v-model:value="form.lastName"
          :input-props="{ id: 'lastName' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Имя (firstName)" :label-props="{ for: 'firstName' }">
        <NInput
          v-model:value="form.firstName"
          :input-props="{ id: 'firstName' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Отчество (middleName)" :label-props="{ for: 'middleName' }">
        <NInput
          v-model:value="form.middleName"
          :input-props="{ id: 'middleName' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="ФИО (fullname)" :label-props="{ for: 'fullname' }">
        <NInput
          v-model:value="form.fullname"
          :input-props="{ id: 'fullname' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Email (email)" :label-props="{ for: 'email' }">
        <NInput v-model:value="form.email" :input-props="{ id: 'email' }" @keydown.enter.prevent />
      </NFormItem>

      <NDivider />

      <NFormItem label="Код поставщика (kksCode)">
        <NInput
          v-model:value="form.kksCode"
          :input-props="{ id: 'kksCode' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Код установки (kksInstallation)">
        <NInput
          v-model:value="form.kksInstallation"
          :input-props="{ id: 'kksInstallation' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Предварительный код системы (kksSystemCode)">
        <NInput
          v-model:value="form.kksSystemCode"
          :input-props="{ id: 'kksSystemCode' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Системная классификация (kksSystem)">
        <NInput
          v-model:value="form.kksSystem"
          :input-props="{ id: 'kksSystem' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Системная нумерация (kksSystemNumber)">
        <NInput
          v-model:value="form.kksSystemNumber"
          :input-props="{ id: 'kksSystemNumber' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Агрегатная классификация (kksUnit)">
        <NInput
          v-model:value="form.kksUnit"
          :input-props="{ id: 'kksUnit' }"
          @keydown.enter.prevent
        />
      </NFormItem>
      <NFormItem label="Агрегатная нумерация (kksUnitNumber)">
        <NInput
          v-model:value="form.kksUnitNumber"
          :input-props="{ id: 'kksUnitNumber' }"
          @keydown.enter.prevent
        />
      </NFormItem>
    </NForm>
  </ViewLayout>
</template>

<script setup lang="ts">
import { initForm, initFormRulesEvaluator } from '@/modules/form'
import { useSettingsStore } from '@/stores/settings'
import { NDivider, NForm, NFormItem, NInput } from 'naive-ui'
import { onUnmounted, ref, toRaw } from 'vue'
import ViewLayout from './ViewLayout.vue'

const settingsStore = useSettingsStore()
const form = ref(initForm())

const { evaluate, terminate: terminateRulesEvaluator } = initFormRulesEvaluator()

onUnmounted(() => {
  terminateRulesEvaluator()
})

async function handleChange(e: Event) {
  const { id } = e.target as HTMLInputElement
  const rulesToTrigger = settingsStore.rules.filter(({ propertyCodes }) =>
    propertyCodes.includes(id)
  )
  const resultForm = await evaluate(toRaw(form.value), rulesToTrigger)
  form.value = resultForm
}
</script>

<style scoped></style>
