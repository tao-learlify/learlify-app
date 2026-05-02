import React, { memo } from 'react'
import { Modal } from 'react-bootstrap'
import classNames from 'clsx'

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
  const viewContentStyle = withView
    ? classNames('dropdown-style')
    : classNames('dropdown-style pt-5 mt-2')

  return (
    <Modal
      show={enabled}
      size={size}
      onHide={onCloseRequest}
      dialogClassName={classNames(
        "modal-90w",
        removePadding || "rounded"
      )}
      className={viewContentStyle}
    >
      {textHeader && (
        <Modal.Header
          closeButton
          className={classNames(
            'text-secondary',
            'font-weight-bold',
            className
          )}
        >
          {textHeader}
        </Modal.Header>
      )}
      <Modal.Body className={classNames(
        className,
        removePadding && 'p-0'
      )}>{children}</Modal.Body>
    </Modal>
  )
}

ModalDialog.defaultProps = {
  size: 'md',
  withView: false
}

export default memo(ModalDialog)
