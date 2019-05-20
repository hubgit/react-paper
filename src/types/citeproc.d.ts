declare module 'citeproc' {
  interface Citation {
    citationItems: { id: string }[]
    properties?: {
      noteIndex?: number
    }
  }

  interface SystemOptions {
    retrieveLocale: (id: string) => string | Document | object
    retrieveItem: (id: string) => object
    variableWrapper: (
      params: {
        context: string
        variableNames: string[]
        itemData: {
          URL: string
          DOI: string
        }
      },
      prePunct: string,
      str: string,
      postPunct: string
    ) => string
  }

  interface BibliographyMetadata {
    bibliography_errors: string[]
    entry_ids: string[]
  }

  type Bibliography = string[]

  export class Engine {
    public constructor(
      sys: SystemOptions,
      style: string,
      lang?: string,
      forceLang?: boolean
    )

    public rebuildProcessorState(
      citations: Citation[],
      mode?: string,
      uncitedItemIDs?: string[]
    ): [string, number, string][] // id, noteIndex, output

    public makeBibliography(): [BibliographyMetadata, Bibliography]
  }

  export function getLocaleNames(
    style: string,
    preferredLocale: string
  ): string[]
}
