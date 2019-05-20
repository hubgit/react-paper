export interface Author {
  id: string
  name: string
  orcid?: string
}

export interface Affiliation {
  name: string
  department?: string
  members: Author[]
}

interface Award {
  name: string
  recipients: Author[]
}

interface Contribution {
  name: string
  contributors: Author[]
}

export interface Funder {
  name: string
  awards: Award[]
}

export interface Metadata {
  title: string
  affiliations: Affiliation[]
  authors: Author[]
  repository?: string
  funders: Funder[]
  contributions: Contribution[]
}
