import { Fragment } from 'react'
import styled from 'styled-components'

import Tag from './Tag'

const Wrap = styled.p`
  letter-spacing: 0.1em;
  margin: 0 0 1em;
`
const Span = styled.span`
  color: ${(p) => p.theme.midl};
`

const TagsList = ({ className, tags }) => {
  return (
    <Wrap className={className}>
      {tags.map(({ label, slug, categoryId, picto }, id) => (
        <Fragment key={slug}>
          {id !== 0 ? <Span> / </Span> : null}
          <Tag label={label} category={categoryId} picto={picto} />
        </Fragment>
      ))}
    </Wrap>
  )
}

export default TagsList
