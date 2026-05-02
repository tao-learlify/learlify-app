import React, { memo, useCallback } from 'react'
import { ic_attach_file as attach } from 'react-icons-kit/md/ic_attach_file'
import { Form } from 'react-bootstrap'
import Icon from 'react-icons-kit'

import 'assets/css/fileuploader.css'

/**
 *
 *  @type {React.FunctionComponent<{ allowedExts: ['json'], fileUploaderName: string, onChange: () => React.ChangeEvent<HTMLInputElement>}>} FileUploader
 */

const FileUploader = ({ allowedExts, onChange, renderEncType }) => {
  /**
   * @param {React.FormEventHandler<HTMLInputElement} event
   */

  const onChangeFileHandler = useCallback(
    ({ target: { files } }) => {
      const [file] = files
      onChange(file)
    },
    [onChange]
  )

  return renderEncType ? (
    <Form encType="multipart/form-data">
      <label className="btn btn-primary btn-sm hovered">
        <Icon icon={attach} />{' '}
        <input type="file" name="file" onChange={onChangeFileHandler} hidden />
      </label>
    </Form>
  ) : (
      <label className="btn btn-primary  btn-sm hovered">
        <Icon icon={attach} />{' '}
        <input type="file" name="file" onChange={onChangeFileHandler} hidden />
      </label>
    )
}

FileUploader.defaultProps = {
  fileUploaderName: 'Cargar Examen',
  allowedExts: ['json'],
  renderEncType: true
}

export default memo(FileUploader)
