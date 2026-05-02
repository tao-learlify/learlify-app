import React from 'react'
import { useTranslation } from 'react-i18next'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styles from './pricing-faq.module.scss'

const PricingFAQ = () => {
  const { t } = useTranslation()

  const faqs = [
    { q: t('PLANS.FAQ.q1'), a: t('PLANS.FAQ.a1') },
    { q: t('PLANS.FAQ.q2'), a: t('PLANS.FAQ.a2') },
    { q: t('PLANS.FAQ.q3'), a: t('PLANS.FAQ.a3') },
    { q: t('PLANS.FAQ.q4'), a: t('PLANS.FAQ.a4') }
  ]

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t('PLANS.FAQ.title')}</h2>
      {faqs.map(({ q, a }, i) => (
        <Accordion key={i} className={styles.accordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={styles.question}>{q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={styles.answer}>{a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default PricingFAQ
