import * as React from 'react'
import styled from 'styled-components'
import { Metadata } from './types/metadata'
// import { Bibliography } from './Bibliography'

export const Footer: React.FC<{ metadata: Metadata }> = ({ metadata }) => (
  <Container>
    {metadata.repository && (
      <PlainSection>
        <SourceLink href={repositoryURL(metadata.repository)} target={'_blank'}>
          View Source
        </SourceLink>
      </PlainSection>
    )}

    {metadata.affiliations && (
      <Section>
        <Heading>Affiliations</Heading>
        {metadata.affiliations.map((affiliation, index) => (
          <Item key={affiliation.name} id={`aff-${index}`}>
            <ItemName>{affiliation.name}</ItemName>
            <ItemName>{affiliation.department}</ItemName>
            <Authors>
              {affiliation.members.map(author => (
                <AuthorName key={author.id}>{author.name}</AuthorName>
              ))}
            </Authors>
          </Item>
        ))}
      </Section>
    )}

    {metadata.funders && (
      <Section>
        <Heading>Funders</Heading>
        {metadata.funders.map((funder, index) => (
          <Item key={funder.name} id={`funder-${index}`}>
            <ItemName>{funder.name}</ItemName>
            {funder.awards.map(award => (
              <Award key={award.name}>
                <ItemName>{award.name}</ItemName>
                <Authors>
                  {award.recipients.map(author => (
                    <AuthorName key={author.id}>{author.name}</AuthorName>
                  ))}
                </Authors>
              </Award>
            ))}
          </Item>
        ))}
      </Section>
    )}

    {metadata.contributions && (
      <Section>
        <Heading>Contributions</Heading>
        {metadata.contributions.map((contribution, index) => (
          <Item key={contribution.name} id={`contribution-${index}`}>
            <ItemName>{contribution.name}</ItemName>
            <Authors>
              {contribution.contributors.map(author => (
                <AuthorName key={author.id}>{author.name}</AuthorName>
              ))}
            </Authors>
          </Item>
        ))}
      </Section>
    )}

    {/* <Section>
      <Heading>References</Heading>
      <Bibliography />
    </Section> */}
  </Container>
)

const repositoryURL = (input: string) =>
  input
    .replace(/^github:/, 'https://github.com/')
    .replace(/^gitlab:/, 'https://gitlab.com/')
    .replace(/^glitch:/, 'https://glitch.com/')

const SourceLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  padding: 2px 4px;
`

const Container = styled.footer`
  font-size: 80%;
`

const Heading = styled.summary`
  font-weight: 200;
  font-size: 150%;
  cursor: pointer;
  
  &::-webkit-details-marker {
    opacity: 0.1;
  }
`

const PlainSection = styled.div`
  margin-top: 8px;
  text-align: right;
`

const Section = styled.details.attrs({ open: true })`
  margin-top: 8px;
  text-align: right;
`

const Item = styled.div`
  margin: 8px 0;
`

const ItemName = styled.div`
  font-weight: bold;
`

const Authors = styled.ul`
  margin: 0;
  list-style-type: none;
`

const AuthorName = styled.li``

const Award = styled.div`
  margin: 4px 0;
`
