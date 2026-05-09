import React, { useCallback, memo } from 'react'
import { Button } from 'components/ui'
import { warning } from 'react-icons-kit/fa/warning'
import Icon from 'react-icons-kit'

import useAuthProvider from 'hooks/useAuthProvider'
import useForm from 'hooks/useForm'
import useToggler from 'hooks/useToggler'

import ModalDialog from './ModalDialog'
import WordsCounter from './WordsCounter'

import httpClient from 'utils/httpClient'
import { equal, getDeviceInfo } from 'utils/functions'
import { ToastsStore } from 'react-toasts'
import { TOAST_EXPIRATION } from 'constant'

/**
 * @typedef {Object} ReportProps
 * @property {boolean} enabled
 * @property {() => void} onClose
 * @property {() => void} onSuccess
 */

const FORM_MAX_LENGTH = 255

/**
 * @type {React.FunctionComponent<ReportProps>}
 */
const Report = ({ context, enabled, onClose, onSuccess }) => {
  const user = useAuthProvider()

  const [form, onChange, reset] = useForm({
    report: ''
  })

  const [loading, setLoading] = useToggler(false)


  const onReport = useCallback(async () => {
    try {
      setLoading()

      const device = getDeviceInfo()

      const data = await httpClient({
        body: {
          context: context,
          from: user.profile.email,
          message: form.report,
          device: `
            <li>Agente: ${device.agent}</li>
            <li>Producto: ${device.product}</li>
            <li>Version: ${device.version}</li>
            <li>Plataforma: ${device.platform}</li>
          `
        },
        endpoint: '/api/v1/report',
        method: 'POST',
        requiresAuth: true
      })


      if (equal(data.statusCode, 400)) {
        setLoading()

        return ToastsStore.info('El mensaje debe contener al menos 15 caracteres', TOAST_EXPIRATION)
      }


      if (equal(data.statusCode, 200)) {
        setLoading()

        ToastsStore.info('Report has been sended', TOAST_EXPIRATION)

        /**
         * @description
         * Sending to the parent component success information.
         */
        onSuccess()

        reset()
      }
    } catch (e) {
      setLoading()

      ToastsStore.error('No se ha podido enviar el reporte', TOAST_EXPIRATION)
    }
  }, [context, form.report, onSuccess, reset, setLoading, user.profile])

  return (
    <React.Fragment>
      <ModalDialog
        enabled={enabled}
        textHeader="Reportar"
        onCloseRequest={onClose}
      >
        <div className="form-group">
          <WordsCounter
            maximum={FORM_MAX_LENGTH}
            message="Envíanos un reporte con el error que has encontrado"
            value={form.report}
          />
          <textarea
            className="form-control tw:w-full tw:rounded-lg tw:border tw:border-gray-300 tw:p-3 focus:tw:border-[#58CC02] focus:tw:ring-1 focus:tw:ring-[#58CC02]"
            name="report"
            onChange={onChange}
            value={form.report}
            placeholder="..."
            maxLength={FORM_MAX_LENGTH}
          />
        </div>
        <div className="form-group">
          <Button
            disabled={loading}
            onClick={onReport}
            className="rounded"
            variant="outline-info"
          >
            Subir Reporte <Icon icon={warning} className="icon" />
          </Button>
        </div>
      </ModalDialog>
    </React.Fragment>
  )
}

Report.defaultProps = {
  onClick: null,
  onClose: null
}

export default memo(Report)
