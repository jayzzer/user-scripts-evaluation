import { EditorView } from '@codemirror/view'

export const theme = EditorView.theme({
  '&': {
    color: '#000',
    backgroundColor: 'rgb(24, 24, 28)',
    paddingLeft: '4px'
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    border: 'none'
  },
  '.cm-line': {
    color: '#fff'
  },
  '.cm-lineNumbers .cm-gutterElement': {
    textAlign: 'center',
    padding: '0 4px'
  },
  '.cm-lineNumbers .cm-gutterElement.cm-activeLineGutter': {
    backgroundColor: 'rgba(170, 207, 236, 0.27)'
  },
  '.cm-activeLine': { backgroundColor: 'rgba(170, 207, 236, 0.27)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    { backgroundColor: '#5255ff' },
  '.ͼb': {
    color: '#c678dd'
  },
  '.ͼg': {
    color: '#fff'
  },
  '.ͼd': {
    color: '#d19a66'
  },
  '.ͼf, .ͼe': {
    color: '#98c379'
  }
})
