// @ts-nocheck

import * as CiteProc from 'citeproc'
import * as React from 'react'
import { ErrorMessage } from './ErrorMessage'

interface BibliographyContextValue {
  addCitation: (keys: string[]) => void
  bibliographyItems?: { [key: string]: string }
  citedKeys?: string[]
  labels?: { [key: string]: string }
}

export const BibliographyContext = React.createContext<
  BibliographyContextValue
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
>({} as BibliographyContextValue)

interface Citation {
  keys: string[]
}

interface Reference {
  id: string
}

export const BibliographyProvider: React.FC<{
  references?: Reference[]
  citationStyle?: string
}> = ({ references = [], citationStyle = 'nature', children }) => {
  const [bibliographyItems, setBibliographyItems] = React.useState<{
    [key: string]: string
  }>()
  const [labels, setLabels] = React.useState<{ [key: string]: string }>()
  const [citations, setCitations] = React.useState<Citation[]>([])
  const [citedKeys, setCitedKeys] = React.useState<string[]>()
  const [error, setError] = React.useState<Error>()

  // initialise the CiteProc processor, then generate labels and bibliography items
  // NOTE: only runs after all descendants have mounted
  React.useEffect(() => {
    if (citations.length) {
      createProcessor(citationStyle, references)
        .then(processor => {
          const { bibliographyItems, labels } = processCitations(
            citations,
            processor
          )

          setLabels(labels)
          setBibliographyItems(bibliographyItems)
          setCitedKeys(Object.keys(bibliographyItems))
        })
        .catch(error => {
          console.error(error)
          setError(error)
        })
    }
  }, [citationStyle, references, citations])

  const addCitation = React.useCallback(
    (keys: string[]) => {
      citations.push({ keys })
      setCitations(citations)
    },
    [citations, setCitations]
  )

  return (
    <BibliographyContext.Provider
      value={{ bibliographyItems, labels, addCitation, citedKeys }}
    >
      {children}
      {error && <ErrorMessage>ERROR: {error.message}</ErrorMessage>}
    </BibliographyContext.Provider>
  )
}

const createProcessor = async (
  citationStyle: string,
  references: Reference[]
) => {
  const referenceMap = new Map()

  for (const item of references) {
    referenceMap.set(item.id, item)
  }

  const style = await fetchCitationStyle(citationStyle)

  const CSL = await import('citeproc')

  const localeMap = new Map()
  const localeNames = CSL.getLocaleNames(style, 'en-GB')

  for (const localeName of localeNames) {
    const locale = await fetchLocale(localeName)
    localeMap.set(localeName, locale)
  }

  return new CSL.Engine(
    {
      retrieveLocale: id => {
        if (!localeMap.has(id)) {
          throw new Error(`Locale ${id} not found`)
        }

        return localeMap.get(id)
      },
      retrieveItem: (id: string) => {
        if (!referenceMap.has(id)) {
          throw new Error(`Reference ${id} not found`)
        }

        return referenceMap.get(id)
      },
      variableWrapper: (params, prePunct, str, postPunct) => {
        if (params.context === 'bibliography') {
          switch (params.variableNames[0]) {
            case 'URL':
              return `${prePunct}<a href="${str}" target="blank">${str}</a>${postPunct}`

            case 'title':
              if (params.itemData.URL) {
                return `${prePunct}<a href="${
                  params.itemData.URL
                }" target="blank">${str}</a>${postPunct}`
              }

              if (params.itemData.DOI) {
                return `${prePunct}<a href="https://doi.org/${
                  params.itemData.DOI
                }" target="blank">${str}</a>${postPunct}`
              }
          }
        }

        return `${prePunct}${str}${postPunct}`
      },
    },
    style
  )
}

const processCitations = (
  citations: Citation[],
  processor: CiteProc.Engine
) => {
  const citationsList = citations.map(citation => ({
    citationItems: citation.keys.map(id => ({ id })),
    properties: {
      noteIndex: 0,
    },
  }))

  const result = processor.rebuildProcessorState(citationsList)

  // build labels
  const labels: { [key: string]: string } = {}

  result.forEach((item, index) => {
    const keys = JSON.stringify(citations[index].keys)
    labels[keys] = item[2]
  })

  // build bibliography
  const bibliographyItems: { [key: string]: string } = {}

  const [message, items] = processor.makeBibliography()

  items.forEach((item, index) => {
    const entryId = message.entry_ids[index]
    bibliographyItems[entryId] = item
  })

  return { bibliographyItems, labels }
}

const fetchLocale = (id: string): Promise<string> =>
  fetch(
    `https://raw.githubusercontent.com/citation-style-language/locales/master/locales-${id}.xml`
  ).then(response => response.text())

const fetchCitationStyle = async (id: string): Promise<string> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/citation-style-language/styles-distribution/master/${id}.csl`
  )

  const xml = await response.text()

  const parentId = findParentId(xml)

  if (parentId) {
    return fetchCitationStyle(parentId)
  }

  return xml
}

const findParentId = (xml: string) => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')

  const link = doc.querySelector('link[rel="independent-parent"]')
  if (!link) return

  const url = link.getAttribute('href')
  if (!url) return

  const matches = url.match(/[a-z0-9-]+$/)
  if (!matches) return

  return matches[1]
}
