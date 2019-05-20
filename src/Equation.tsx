import * as React from 'react'

// TODO: make this into a provider

export const Equation: React.FC<{ tex: string }> = ({ tex }) => {
  const outputRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (outputRef.current) {
      renderEquation(tex, outputRef.current).catch(error => {
        console.error(error)
      })
    }
  }, [outputRef, renderEquation])

  return <div ref={outputRef} />
}

export const InlineEquation: React.FC<{ tex: string }> = ({ tex }) => {
  const outputRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (outputRef.current) {
      renderEquation(tex, outputRef.current).catch(error => {
        console.error(error)
      })
    }
  }, [outputRef, renderEquation])

  return <span ref={outputRef} />
}

const renderEquation = async (
  tex: string,
  container: HTMLElement,
  displayMode: boolean = false
) => {
  await import('katex/dist/katex.css')
  const { render } = await import('katex')
  render(tex, container, { displayMode })
}
