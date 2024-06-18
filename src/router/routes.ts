import FormView from '@/views/FormView.vue'
import SettingsView from '@/views/SettingsView.vue'

export const routes = [
  { path: '/', name: 'form', component: FormView },
  { path: '/settings', name: 'settings', component: SettingsView }
]
