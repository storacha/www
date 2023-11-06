// from https://github.com/shikijs/next-shiki/commit/b2639c704c0e2eab91c55c08a0419e6b502229eb
import type { Highlighter, Lang, Theme } from 'shiki'
import { renderToHtml, getHighlighter } from 'shiki'

let highlighter: Highlighter

export async function highlight(code: string, theme: Theme, lang: Lang) {
  if (!highlighter) {
    highlighter = await getHighlighter({
      langs: [lang],
      theme: theme
    })
  }

  const tokens = highlighter.codeToThemedTokens(code, lang, theme, {
    includeExplanation: false
  })
  const html = renderToHtml(tokens, { bg: 'transparent' })

  return html
}
