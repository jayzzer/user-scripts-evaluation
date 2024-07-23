<template>
  <NConfigProvider :theme="lightTheme">
    <NLayout has-sider>
      <NLayoutSider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <NMenu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </NLayoutSider>
      <NLayout class="content-layout">
        <RouterView />
      </NLayout>
    </NLayout>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { DocumentText, Settings } from '@vicons/ionicons5'
import {
  NConfigProvider,
  NIcon,
  NLayout,
  NLayoutSider,
  NMenu,
  lightTheme,
  type MenuOption
} from 'naive-ui'
import { h, ref, type Component } from 'vue'
import { RouterLink } from 'vue-router'

const collapsed = ref(true)
const activeKey = ref<string>()

const menuOptions: MenuOption[] = [
  {
    key: 'form',
    label: () => h(RouterLink, { to: { name: 'form' } }, { default: () => 'Форма' }),
    icon: renderIcon(DocumentText)
  },
  {
    key: 'settings',
    label: () => h(RouterLink, { to: { name: 'settings' } }, { default: () => 'Настройки' }),
    icon: renderIcon(Settings)
  }
]

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>

<style scoped>
.content-layout {
  min-height: 100vh;
}
</style>
