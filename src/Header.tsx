import * as React from 'react'
import styled from 'styled-components'
import { Author } from './Author'
import { Metadata } from './types/metadata'

export const Header: React.FC<{ metadata: Metadata }> = ({ metadata }) => (
  <Container>
    <Title>{metadata.title}</Title>

    <Authors>
      {metadata.authors.map((author, index) => (
        <AuthorContainer key={author.id}>
          {index > 0 && <span>, </span>}
          <Author author={author} />
        </AuthorContainer>
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

const AuthorContainer = styled.span`
  white-space: nowrap;
`
