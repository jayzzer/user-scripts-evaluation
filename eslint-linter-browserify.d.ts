interface Rule {
  meta: { docs: { description: string; recommended: boolean; url: string } }
}

declare module 'eslint-linter-browserify' {
  export class Linter {
    getRules(): Map<string, Rule>
  }
}
