import { highlight } from '@/lib/shiki'
import { Lang, Theme } from 'shiki'

const w3upExample = `
import { filesFromPaths } from 'files-from-path'
import { create } from '@web3-storage/w3up-client'
const client = await create()

// assert your identity
await client.authorize('you@example.org')

// claim your space
const space = await client.createSpace('lets-go')
await client.setCurrentSpace(space.did())

// content-address your files
const files = await filesFromPaths(['./best-gifs'])
const root = await client.uploadDirectory(files)

// bafy...
console.log(root.toString())
`.trim()

export async function SyntaxHighlight ({code, theme = 'dracula-soft', lang = 'javascript'}: {code: string, theme?: Theme, lang?: Lang}) {
  const html = await highlight(code, theme, lang)
  return <div dangerouslySetInnerHTML={{ __html: html }} className='font-mono' />
}

export function CodeSample (props: {code: string, theme?: Theme, lang?: Lang}) {
  return (
    <div className='border-8 border-zinc-300/10 rounded-md p-4 pl-2 text-md'>
      <SyntaxHighlight {...props} />
    </div>
  )
}

export function W3UPClientExample () {
  return <CodeSample code={w3upExample} />
}
