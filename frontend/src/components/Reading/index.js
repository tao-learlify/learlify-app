import React, { memo, useMemo, useRef } from 'react'
import { Col, Row, FormControl } from 'react-bootstrap'
import { ic_drag_handle } from 'react-icons-kit/md/ic_drag_handle'

import Module from 'common'
import Dragula from 'react-dragula'
import InnerImageZoom from 'react-inner-image-zoom'
import Icon from 'react-icons-kit'
import lang from 'lang'

import 'assets/css/reading.css'

import useExamConsumer from 'hooks/useExamConsumer'

import AsyncComponent from 'components/AsyncComponent'
import AudioPlayer from 'components/AudioPlayer'
import BreaklineText from 'components/BreaklineText'
import Dynamic from 'components/Dynamic'
import Management from 'components/Management'
import Text from 'components/Text'
import TableHeader from 'components/TableHeader'
import TableRow from 'components/TableRow'
import Selection from 'components/Selection'
import ScrollView from 'components/ScrollView'
import RegExpIntercept from 'components/RegExpIntercept'

import SkillReading from 'assets/illustrations/skills/reading.svg'

import {
  AnswerContainer,
  Circle,
  ContentContainer,
  SelectionContainer,
  TextSmall
} from './styles'

import {
  chainArray,
  extended,
  getNumberOf,
  isModular,
  removeInterceptableText,
  shuffle
} from 'utils/functions'

import css from './reading.module.scss'
import { breaklineUtils } from './utils'
import { getAZIndex } from 'modules/az'
import { DRAG_AND_DROP_CONTAINER as DragContainer } from 'constant'
import {
  READING_PART_1,
  READING_PART_2,
  READING_PART_3,
  READING_PART_4,
  READING_PART_5
} from 'constant/labels'
import Select from 'components/Select'

const readonlyStyles = {
  fontSize: 12
}

/**
 * @type {React.FunctionComponent<ReadingProps>}
 */
const Reading = () => {
  const { exercise } = useExamConsumer()

  const { label } = exercise

  switch (label) {
    case READING_PART_1:
      return <ReadingPartOne />

    case READING_PART_2:
      return <ReadingPartTwo />

    case READING_PART_3:
      return <ReadingPartThree />

    case READING_PART_4:
      return <ReadingPartFour />

    case READING_PART_5:
      return <ReadingPartFive />

    default:
      return <React.Fragment />
  }
}

/**
 * @type {React.FunctionComponent<ReadingProps>}
 */
const ReadingPartOne = () => {
  const { selections, exercise, handleSelection } = useExamConsumer()

  const { description, questions } = exercise

  const handleExtended = ({ answers }) => {
    return extended(answers, 'modules' in exercise ? lang.t('ALL.PICK') : '')
  }

  return (
    <div className={css.padding}>
      <br />
      <Text dunkin bold color="blue" tag="h5">
        {description} <img alt="book" src={SkillReading} width={35} />
      </Text>
      <hr />
      <div className="ml-3">
        {questions.map((question, index) => (
          <RegExpIntercept
            key={question.title}
            expression={Module.RegExp.intercept}
            fragment={true}
            value={question.title}
            breaklineChars
            breaklineProps={breaklineUtils.props}
          >
            <SelectionContainer>
              <Selection
                className="dropdown-style select-css"
                options={handleExtended(question)}
                onChange={event =>
                  handleSelection({ title: event.target.value, index })
                }
                selection={[]}
                value={selections[index]}
              />
            </SelectionContainer>
          </RegExpIntercept>
        ))}
      </div>
    </div>
  )
}

/**
 * @type {React.FunctionComponent<ReadingProps>}
 */
const ReadingPartTwo = () => {
  const nodeRef = useRef(null)

  const { exercise } = useExamConsumer()

  const { description, questions } = exercise

  // useEffect(() => {
  //   const observer = new MutationObserver(mutationRecords => {
  //     mutationRecords.forEach(mutationRecord => {
  //       if (mutationRecord.type === 'attributes') {
  //       }
  //     })
  // )

  //   observer.observe(nodeRef.current, {
  //     attributes: true
  //   })

  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [])

  const DraggableComponent = useMemo(
    () => componentBackingInstance => {
      if (componentBackingInstance) {
        Dragula([componentBackingInstance], {})
      }
    },
    []
  )
  /**
   * @param {string} letters
   * @returns
   */
  const removeFirstLetter = letters => letters.substring(2, letters.length - 1)

  return (
    <div className={css.padding} ref={nodeRef}>
      <br />
      <Text dunkin color="blue" tag="h3">
        Order the sentences <img alt="books" src={SkillReading} width={40} />
      </Text>
      <hr />
      <br />
      <BreaklineText
        lighter
        matchTextClassName="m-0 p-0"
        splitWithDiv
        tag="h5"
        color="blue"
        value={description}
      />
      <br />
      <div className={css.order} ref={DraggableComponent} id={DragContainer}>
        {questions.map((question, index) => (
          <div className={css.container} key={question.title}>
            <Icon icon={ic_drag_handle} size={20} />
            <Circle className={css.margin}>{getAZIndex(index)}</Circle>
            <Text className="m-0" color="dark" lighter tag="p">
              {removeFirstLetter(question.title)}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const ReadingPartThree = () => {
  const extendedRef = useRef({
    title: '',
    id: 0
  })

  const { handleSelection, exercise, disabled, selections } = useExamConsumer()

  return (
    <div className={css.padding}>
      <br />
      {exercise.description && (
        <BreaklineText
          dunkin
          color="blue"
          splitWithDiv
          tag="h5"
          value={exercise.description}
        />
      )}
      <hr />
      <br />
      {exercise.questions.map((question, index) => (
        <RegExpIntercept
          fragment
          expression={Module.RegExp.intercept}
          key={question.title}
          value={question.title}
          breaklineChars={{
            lighter: true,
            color: 'dark'
          }}
        >
          <Select
            disabled={disabled}
            options={extended(question.answers, extendedRef.current)}
            onPick={pick =>
              handleSelection({
                title: pick.target.value,
                index
              })
            }
            optionKeyName="title"
            value={selections[index]}
            selection={[]}
          />
        </RegExpIntercept>
      ))}
    </div>
  )
}

/**
 * @type {React.FunctionComponent<ReadingProps>}
 */
const ReadingPartFour = () => {
  const { data, selections, exercise, handleSelection, handleLevelSelection } =
    useExamConsumer()

  const { description, heading, recordingUrl, imageUrl } = exercise

  /**
   * @description
   * Modular mean that is connected to IELTS Format.
   */
  const { connected, context } = isModular(exercise, data.level)

  /**
   * This functions takes information about user is writing/selecting.
   * @param {{}} userSelection
   */
  const handleDynamicChange = userSelection => {
    data.context
      ? handleLevelSelection(userSelection)
      : handleSelection(userSelection)
  }

  if (connected && description === null) {
    return (
      <div className={css.padding}>
        <Text dunkin color="blue" tag="h5">
          {connected || (
            <>
              Reading <img alt="reading" lazy="true" src={SkillReading} width={32} />
            </>
          )}
        </Text>
        <hr />
        <Row>
          <Col xs={12} sm={8}>
            <ContentContainer>
              {heading && (
                <BreaklineText
                  bold
                  value={heading}
                  color="blue"
                  splitWithDiv
                  tag="h5"
                />
              )}
              {context.subtitle && (
                <BreaklineText
                  lighter={true}
                  bold
                  color="muted"
                  value={context.subtitle}
                  tag="h5"
                  splitWithDiv
                />
              )}
              {context.questions.map((question, index) => (
                <AnswerContainer key={question.title}>
                  {question.title && (
                    <Text lighter bold color="blue" tag="small">
                      <TextSmall>
                        {removeInterceptableText(question.title)}
                      </TextSmall>
                    </Text>
                  )}
                  <Dynamic
                    answers={question.answers}
                    module={context.module}
                    onChangeForm={title =>
                      handleDynamicChange({
                        title,
                        index
                      })
                    }
                    onChangeDropdown={title =>
                      handleDynamicChange({
                        title,
                        index
                      })
                    }
                    value={
                      connected
                        ? data.context
                          ? data.context[data.level].selections[index]
                          : ''
                        : selections[index]
                    }
                    matchLengthInput={1}
                  />
                </AnswerContainer>
              ))}
            </ContentContainer>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div className={css.padding}>
      <Text dunkin color="blue" tag="h5">
        {connected || (
          <>
            Reading <img alt="reading" src={SkillReading} width={32} />
          </>
        )}
      </Text>
      <hr />
      <Row>
        <Col xs={12} sm={6}>
          <ContentContainer>
            <ScrollView>
              {heading && (
                <BreaklineText
                  bold
                  value={heading}
                  color="blue"
                  splitWithDiv
                  tag="h5"
                />
              )}
              {imageUrl && (
                <AsyncComponent resource={imageUrl}>
                  <img
                    alt="listening"
                    className="img-fluid rounded border"
                    src={imageUrl}
                    width={440}
                  />
                </AsyncComponent>
              )}
              <br />
              {description && (
                <BreaklineText
                  lighter={true}
                  tag="h5"
                  color="dark"
                  value={description}
                  splitWithDiv
                />
              )}
              {recordingUrl && (
                <div className="pl-3">
                  <AudioPlayer url={recordingUrl} />
                </div>
              )}
            </ScrollView>
          </ContentContainer>
        </Col>
        <Col xs={12} sm={6}>
          {context.title && (
            <BreaklineText
              bold
              color="blue"
              value={context.title}
              tag="p"
              splitWithDiv
            />
          )}
          {context.subtitle && (
            <BreaklineText
              lighter={true}
              bold
              color="muted"
              value={context.subtitle}
              tag="h5"
              splitWithDiv
            />
          )}
          {context.imageUrl && (
            <AsyncComponent resource={context.imageUrl}>
              <InnerImageZoom
                className="border rounded"
                src={context.imageUrl}
                width={340}
              />
            </AsyncComponent>
          )}
          {context.questions.map((question, index) => (
            <AnswerContainer key={question.title}>
              {question.title && (
                <Text lighter bold color="blue" tag="small">
                  <TextSmall>
                    {removeInterceptableText(question.title)}
                  </TextSmall>
                </Text>
              )}
              <Dynamic
                answers={question.answers}
                module={context.module}
                onChangeForm={title =>
                  handleDynamicChange({
                    title,
                    index
                  })
                }
                onChangeDropdown={title =>
                  handleDynamicChange({
                    title,
                    index
                  })
                }
                value={
                  connected
                    ? data.context
                      ? data.context[data.level].selections[index]
                      : ''
                    : selections[index]
                }
                matchLengthInput={1}
              />
            </AnswerContainer>
          ))}
          <br />
        </Col>
      </Row>
    </div>
  )
}
/**
 * @type {React.FunctionComponent<ReadingProps>}
 */
const ReadingPartFive = () => {
  const { selections, exercise, handleSelection } = useExamConsumer()

  const { description, questions } = exercise

  const shuffleMemo = useMemo(() => shuffle(questions), [questions])

  const options = useMemo(
    () => extended(chainArray(shuffleMemo, 'answers')),
    [shuffleMemo]
  )

  return (
    <div className={css.padding}>
      <br />
      <Text dunkin color="blue" tag="h5">
        {description} <img alt="reading" src={SkillReading} width={32} />
      </Text>
      <hr />
      <Row>
        <Col xs={12} md={7}>
          <ScrollView>
            {questions.map(question => (
              <Text lighter color="dark" key={question.title} tag="p">
                {removeInterceptableText(question.title)}
              </Text>
            ))}
          </ScrollView>
        </Col>
        <Col xs={12} md={5}>
          <div className="rounded">
            <Management
              border={false}
              alternative
              className={css.table}
              rows={headings}
            >
              {questions.map((question, index) => (
                <TableRow key={question.title}>
                  <TableHeader value={getNumberOf(question.title)} />
                  <TableHeader>
                    <FormControl
                      as="select"
                      value={selections[index]}
                      style={readonlyStyles}
                      onChange={event =>
                        handleSelection({
                          title: event.target.value,
                          index: index
                        })
                      }
                    >
                      {options.map(answer => (
                        <option
                          disabled={selections.includes(answer)}
                          key={answer}
                          value={answer}
                        >
                          {answer}
                        </option>
                      ))}
                    </FormControl>
                  </TableHeader>
                </TableRow>
              ))}
            </Management>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const headings = [
  'Order',
  'Heading'
]

export default memo(Reading)
