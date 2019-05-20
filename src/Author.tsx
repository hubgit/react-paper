import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Manager, Popper, Reference } from 'react-popper'
import { Arrow } from './Arrow'
import { AuthorOrcid } from './AuthorOrcid'
import { Author as AuthorData } from './types/metadata'
import styled from 'styled-components'

export const Author: React.FC<{ author: AuthorData }> = ({ author }) => {
  const [isOpen, setOpen] = React.useState<boolean>(false)

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <AuthorName ref={ref} onClick={() => setOpen(!isOpen)}>
            {author.name}
          </AuthorName>
        )}
      </Reference>

      {isOpen &&
        ReactDOM.createPortal(
          <Popper placement={'bottom'} positionFixed={true}>
            {({ ref, style, placement, arrowProps }) => (
              <div ref={ref} style={style} data-placement={placement}>
                <AuthorPopper>
                  <div>{author.name}</div>

                  {author.orcid && <AuthorOrcid id={author.orcid} />}
                </AuthorPopper>

                <Arrow
                  ref={arrowProps.ref}
                  style={arrowProps.style}
                  data-placement={placement}
                />
              </div>
            )}
          </Popper>,
          document.getElementById('popper') as HTMLDivElement
        )}
    </Manager>
  )
}

const AuthorName = styled.span`
  cursor: pointer;
`

const AuthorPopper = styled.div`
  max-width: 400px;
  box-shadow: 0 1px 3px #ddd;
  border-radius: 4px;
  padding: 16px 32px;
  background: white;
  border: 1px solid #eee;
  font-family: 'Noto Sans', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`
