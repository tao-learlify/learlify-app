import React, { memo } from 'react'
import { Accordion, Card } from 'react-bootstrap'
import 'assets/css/accordion.css'

/**
 * @typedef {Object} AccordionProps
 * @property {number} accordionsNumbers
 * @property {string} title
 * @property {string} eventKey
 * @property {string} style
 * @property {string} bodystyle
 */

/**
 * @type {React.FunctionComponent<AccordionProps>}
 */

const AptisAccordion = ({ children, title, eventKey, styleJsx, bodystyle }) => {
  return (
    <div>
      <Accordion.Toggle className={styleJsx} eventKey={eventKey}>
        {title}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body className={bodystyle}>{children}</Card.Body>
      </Accordion.Collapse>
    </div>
  )
}

AptisAccordion.defaultProps = {
  styleJsx: 'accordion-header',
  bodystyle: 'accordion-body'
}

export default memo(AptisAccordion)
