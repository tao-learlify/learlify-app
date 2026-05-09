import React, { memo } from 'react'
import classNames from 'clsx'
import { Modal } from 'components/ui'

/**
 * @typedef {Object} ModalDialogProps
 * @property {boolean} enabled
 * @property {Reatct.Node} children
 * @property {string} className
 * @property {() => void} onCloseRequest
 * @property {string} textHeader
 * @property {'xs' | 'sm' | 'md' | 'lg'} size
 * @property {boolean} withView
 */

/**
 * @type {React.FunctionComponent<ModalDialogProps>}
 */
const ModalDialog = ({
  className,
  children,
  enabled,
  onCloseRequest,
  textHeader,
  size,
  removePadding,
  withView
}) => {
  return (
    <Modal
      isOpen={enabled}
      size={size}
      onClose={onCloseRequest}
      title={textHeader || undefined}
      hideClose={!textHeader}
      className={classNames(
        withView ? 'dropdown-style' : 'dropdown-style pt-5 mt-2',
        removePadding && 'p-0'
      )}
    >
      <div className={classNames(className, removePadding && 'p-0')}>
        {children}
      </div>
    </Modal>
  )
}

ModalDialog.defaultProps = {
  size: 'md',
  withView: false
}

export default memo(ModalDialog)
