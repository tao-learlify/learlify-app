import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CheckCircle } from '@phosphor-icons/react'
import { unwrapResult } from '@reduxjs/toolkit'
import { ToastsStore } from 'react-toasts'

import { Modal, Badge } from 'components/ui'
import {
  PracticeModelBadge,
  PRACTICE_MODEL_META
} from 'components/ui/PracticeModelBadge'
import { Button } from 'components/ui/Button'
import useModels from 'hooks/useModels'
import useLocalStorage from 'hooks/useLocalStorage'

import { patchModelThunk } from 'store/@thunks/models'
import { selectModel } from 'store/@reducers/models'

import { TOAST_EXPIRATION } from 'constant'

import styles from './PracticeModelSelector.module.scss'

/**
 * PracticeModelSelector — Self-contained selector for switching practice model.
 *
 * Renders a clickable badge trigger (with chevron) + a Modal for selection.
 * Uses existing `patchModelThunk` → updates token + Redux selected.
 * Does NOT perform optimistic updates — state updates only on success.
 *
 * @param {{ className?: string }} props
 */
const PracticeModelSelector = memo(function PracticeModelSelector({
  className
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const ls = useLocalStorage()
  const { model: currentModel, data: availableModels } = useModels()

  const [isOpen, setIsOpen] = useState(false)
  const [pendingModel, setPendingModel] = useState(null)
  const [saving, setSaving] = useState(false)

  // Guard: prevent state updates after unmount (triggered when selectModel
  // causes a re-render chain that unmounts this component mid-async).
  const mountedRef = useRef(true)
  useEffect(
    () => () => {
      mountedRef.current = false
    },
    []
  )

  const open = useCallback(() => {
    setPendingModel(currentModel)
    setIsOpen(true)
  }, [currentModel])

  const close = useCallback(() => {
    if (saving) return
    setIsOpen(false)
    setPendingModel(null)
  }, [saving])

  const handleSave = useCallback(async () => {
    if (!pendingModel || pendingModel?.id === currentModel?.id) {
      close()
      return
    }

    setSaving(true)
    try {
      const result = await dispatch(patchModelThunk(pendingModel.name)).then(
        unwrapResult
      )
      // Update token + global Redux state first — these don't touch local state
      ls.setItem(result.response.token)
      dispatch(selectModel(pendingModel))
      // Toast is fire-and-forget, safe outside the mounted guard
      ToastsStore.success(
        t('MODELS.SELECTOR.successToast', {
          defaultValue: 'Practice model updated'
        }),
        TOAST_EXPIRATION
      )
      // selectModel() may re-render the tree and unmount this component;
      // only update local state if we're still mounted.
      if (mountedRef.current) {
        setIsOpen(false)
        setPendingModel(null)
      }
    } catch {
      ToastsStore.error(
        t('MODELS.SELECTOR.errorToast', {
          defaultValue: 'Could not update practice model. Please try again.'
        }),
        TOAST_EXPIRATION
      )
    } finally {
      if (mountedRef.current) {
        setSaving(false)
      }
    }
  }, [pendingModel, currentModel, dispatch, ls, t, close])

  // Don't render selector if there's only one model or none
  if (!currentModel || availableModels.length <= 1) {
    return <PracticeModelBadge model={currentModel} className={className} />
  }

  return (
    <>
      {/* ── Trigger: clickable badge ────────────────────────────────── */}
      <PracticeModelBadge
        model={currentModel}
        showChevron
        onClick={open}
        className={className}
      />

      {/* ── Modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        size="sm"
        title={t('MODELS.SELECTOR.title', {
          defaultValue: 'Choose your practice model'
        })}
        footer={
          <div className={styles.footer}>
            <Button variant="ghost" size="md" onClick={close} disabled={saving}>
              {t('MODELS.SELECTOR.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              loading={saving}
              disabled={saving || pendingModel?.id === currentModel?.id}
            >
              {t('MODELS.SELECTOR.save', { defaultValue: 'Save changes' })}
            </Button>
          </div>
        }
      >
        <div className={styles.body}>
          <p className={styles.description}>
            {t('MODELS.SELECTOR.description', {
              defaultValue:
                'Select the exam model you want to practice. Your dashboard, exercises and evaluations will adapt to this model.'
            })}
          </p>

          <ul
            className={styles.modelList}
            role="listbox"
            aria-label="Practice models"
          >
            {availableModels.map(m => {
              const meta = PRACTICE_MODEL_META[m.name]
              if (!meta) return null

              const isSelected = pendingModel?.id === m.id
              const isCurrent = currentModel?.id === m.id

              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.modelOption} ${isSelected ? styles.modelOptionSelected : ''}`}
                    onClick={() => setPendingModel(m)}
                    data-model={m.name}
                  >
                    <div className={styles.modelOptionLeft}>
                      <Badge variant={meta.badgeVariant} dot>
                        {meta.label}
                      </Badge>
                      {isCurrent && (
                        <span className={styles.currentTag}>
                          {t('MODELS.SELECTOR.current', {
                            defaultValue: 'Current'
                          })}
                        </span>
                      )}
                    </div>

                    <p className={styles.modelDescription}>
                      {t(`MODELS.${m.name}`, { defaultValue: '' })}
                    </p>

                    {isSelected && (
                      <CheckCircle
                        size={20}
                        weight="fill"
                        className={styles.checkIcon}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Modal>
    </>
  )
})

export default PracticeModelSelector
export { PracticeModelSelector }
