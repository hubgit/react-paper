import * as React from 'react'
import styled from 'styled-components'
import { AuthorOrcid } from './AuthorOrcid'
import { Metadata } from './types/metadata'

export const Header: React.FC<{ metadata: Metadata }> = ({ metadata }) => (
  <Container>
    <Title>{metadata.title}</Title>

    <Authors>
      {metadata.authors.map((author, index) => (
        <Author key={author.id}>
          {index > 0 && <span>, </span>}
          <span>{author.name}</span>
          {author.orcid && <AuthorOrcid id={author.orcid} />}
        </Author>
      ))}
    </Authors>
  </Container>
)

const Container = styled.header`
  padding: 16px 0;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 200;
`

const Authors = styled.div``

const Author = styled.span`
  white-space: nowrap;
`
