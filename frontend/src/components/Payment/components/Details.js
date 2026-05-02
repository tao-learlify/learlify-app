import React from 'react'
import classNames from 'clsx'
import { SpiralSpinner } from 'react-spinners-kit'
import { useTranslation } from 'react-i18next'
import { check } from 'react-icons-kit/fa/check'
import { times } from 'react-icons-kit/fa/times'
import Icon from 'react-icons-kit'

import useAccess from 'hooks/useAccess'

import Management from 'components/Management'
import TableRow from 'components/TableRow'
import TableHeader from 'components/TableHeader'
import Text from 'components/Text'

import styles from '../payment.module.scss'
import { getPackagePrice } from 'utils/functions'

const Details = ({ data, disabled, loading, onClick, current }) => {
  const { accesses, haveAccess } = useAccess()

  const { t } = useTranslation()

  return (
    <div className={styles.required}>
      <Management
        alternative
        bold
        className={styles.management}
        border={false}
        color="dark"
        size="sm"
        rows={[
          t('PLANS.package'),
          t('PLANS.price'),
          t('PLANS.exams'),
          t('PLANS.classes'),
          t('PLANS.course')
        ]}
      >
        {loading ? (
          <SpiralSpinner />
        ) : (
          data.map(detail => (
            <TableRow key={detail.id}>
              <TableHeader className={styles.radio}>
                {current && (
                  <>
                    <input
                      disabled={disabled}
                      checked={detail.name === current.name}
                      className={classNames(styles.input, 'radio-group')}
                      type="radio"
                      name="plan"
                      onChange={onClick}
                      onClick={onClick}
                      value={detail.name}
                    />
                  </>
                )}
                <Text lighter bold tag="small" color="blue">
                  {detail.name}
                </Text>
              </TableHeader>
              <TableHeader>
                <Text lighter bold color="blue" tag="small">
                  {getPackagePrice(detail.taxe ? detail.taxe : detail.price)} {detail.currency}
                </Text>
              </TableHeader>
              <TableHeader>
                {haveAccess(detail, [accesses.EXAMS]) ? (
                  <Icon className="text-success" icon={check} />
                ) : (
                  <Icon className="text-danger" icon={times} />
                )}
              </TableHeader>
              <TableHeader>
                <Text lighter bold color="blue" tag="small">
                  {detail.classes ? detail.classes : 'N/A'}
                </Text>
              </TableHeader>
              <TableHeader>
                {haveAccess(detail, [accesses.COURSES]) ? (
                  <Icon className="text-success" icon={check} />
                ) : (
                  <Icon className="text-danger" icon={times} />
                )}
              </TableHeader>
            </TableRow>
          ))
        )}
      </Management>
    </div>
  )
}

export default Details
