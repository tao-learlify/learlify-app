import React from 'react'
import {ic_check} from 'react-icons-kit/md/ic_check'
import Icon from 'react-icons-kit'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import useModels from 'hooks/useModels'

import Text from 'components/Text'

import { withModels } from 'hocs'

import styles from '../styles.module.scss'
import { img } from 'assets/compat'
import { Button } from 'components/ui'
import { BLUE, TURQUOISE } from 'assets/colors'

import AptisTeacherPanda from 'assets/illustrations/pandas/panda-speaking.svg'

/**
 * @type {React.FunctionComponent<PreviewProps>}
 */
const Preview = ({ onStart, onDemo }) => {
  const { model } = useModels()

  return (
    <div>
      <img className={styles.background} alt="utilities" src='https://dkmwdxc6g4lk7.cloudfront.net/assets/img/utilities.png' />
      <br />
      <Text dunkin center tag="h1" color="blue">
        {model.name} COURSE <img alt="panda" src={img.love} />
      </Text>
      <br />
      <Text lighter tag="h5">
        This course is focused on students that need to obtain as soon as
        possible the <b>{model.name} certification.</b>
        <br />
        <br />
        The student will have access to:
      </Text>
      <br />
      <div className="d-flex flex-wrap">
        <div style={{ flex: '2 1 500px', minWidth: 0 }}>
          <List style={{ width: '100%', backgroundColor: 'transparent' }}>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="A complete section of grammar with exercises" />
            </ListItem>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="Two listening exercises (format strictly equal to the exam)" />
            </ListItem>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="Speaking section (format strictly equal to the exam)" />
            </ListItem>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="One complete writing exercise (format strictly equal to the exam)." />
            </ListItem>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="Two annexes with tips, and tricks for the speaking and listening sections." />
            </ListItem>
            <ListItem className={styles.listItem}  alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="Two listening exercises (format strictly equal to the exam)" />
            </ListItem>
            <ListItem className={styles.listItem}  alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="Vocabulary that we must learn.." />
            </ListItem>
            <ListItem className={styles.listItem} alignItems="center">
            <ListItemIcon>
              <Icon className="text-success"  size={24} icon={ic_check} />
            </ListItemIcon>
              <ListItemText primary="One review unit, to review the basics before the start of the course." />
            </ListItem>
          </List>
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 0 }}>
          <div>
            <img alt="panda" src={AptisTeacherPanda} width={300} />
          </div>
          <div className="d-flex justify-content-around">
            <Button size="lg" background={TURQUOISE} onClick={onDemo}>
              Demo
            </Button>
            <Button size="lg" background={BLUE} onClick={onStart}>
              Start
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withModels(Preview)
