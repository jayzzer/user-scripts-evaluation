<template>
  <div ref="editorRef" class="code-editor"></div>
</template>

<script setup lang="ts">
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import {
  esLint,
  javascript,
  javascriptLanguage,
  scopeCompletionSource
} from '@codemirror/lang-javascript'
import { bracketMatching, defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { linter } from '@codemirror/lint'
import { EditorState } from '@codemirror/state'
import {
  EditorView,
  ViewUpdate,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers
} from '@codemirror/view'
import { Linter } from 'eslint-linter-browserify'
import { onMounted, ref, watch } from 'vue'
import { theme } from '../theme'

interface Props {
  scope?: Record<string, unknown>
  eslintConfig?: Record<string, unknown>
}
const props = defineProps<Props>()

const code = defineModel<string>()

const editorRef = ref<HTMLDivElement>()

const esLinter = new Linter()
const eslintConfig = {
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  ...props.eslintConfig
}

const state = EditorState.create({
  doc: code.value,
  extensions: [
    lineNumbers(),
    drawSelection(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    theme,
    javascript(),
    syntaxHighlighting(defaultHighlightStyle),
    closeBrackets(),
    bracketMatching(),
    autocompletion(),
    javascriptLanguage.data.of({
      autocomplete: scopeCompletionSource(props.scope)
    }),
    keymap.of([...defaultKeymap, indentWithTab]),
    EditorView.updateListener.of(handleEditorViewUpdate),
    linter(esLint(esLinter, eslintConfig))
  ]
})
const view = ref<EditorView>()

watch(code, () => {
  setEditorDoc(code.value)
})

function getEditorDoc(state?: EditorState) {
  return state?.doc.toString() ?? view.value?.state.doc.toString()
}

function setEditorDoc(newDoc: string | undefined) {
  if (newDoc === getEditorDoc()) return

  view.value?.dispatch({
    changes: {
      from: 0,
      to: view.value?.state.doc.length,
      insert: newDoc
    }
  })
}

function handleEditorViewUpdate(e: ViewUpdate) {
  if (e.docChanged) {
    handleEditorDocChanged(e)
  }
}

function handleEditorDocChanged(e: ViewUpdate) {
  code.value = getEditorDoc(e.state)
}

onMounted(() => {
  view.value = new EditorView({ state, parent: editorRef.value })
})
</script>

<style scoped>
@font-face {
  font-family: 'JetBrainsMono';
  font-weight: normal;
  font-style: normal;
  font-display: swap;
  src:
    local('JetBrainsMono-Regular'),
    url('@/assets/fonts/jet-brains-mono/JetBrainsMono-Regular.woff2') format('woff2');
}

.code-editor {
  width: 80vw;
  min-height: 100px;
  max-height: 400px;
  border-radius: 4px;
  border: 1px solid #000;
}

.code-editor ::v-deep(.cm-editor) {
  height: 100%;
  font-size: 13px;
  border-radius: 4px;
}
.code-editor ::v-deep(.cm-scroller) {
  font-family: 'JetBrainsMono', monospace;
  font-variant-ligatures: none;
}
</style>
