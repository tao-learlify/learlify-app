import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import moment from 'moment'


import { blue } from '@material-ui/core/colors'

import Icon from 'react-icons-kit'
import { ic_library_music } from 'react-icons-kit/md/ic_library_music'
import { ic_mode_edit } from 'react-icons-kit/md/ic_mode_edit'
import { ic_stars } from 'react-icons-kit/md/ic_stars'
import {ic_verified_user} from 'react-icons-kit/md/ic_verified_user'


import useToggler from 'hooks/useToggler'
import useHttpClient from 'hooks/useHttpClient'

import FallbackMode from 'components/FallbackMode'

import { GET } from 'providers/http'
import { getFullName } from 'utils/functions'

import { img } from 'assets/img'
import { BLUE } from 'assets/colors'
import FlexContainer from 'components/FlexContainer'

const useStyles = makeStyles(theme => ({
  root: {
    color: BLUE,
    maxWidth: 350
  },
  media: {
    borderRadius: '10px',
    height: 0,
    width: 150,
    paddingTop: '56.25%' // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: blue[500]
  }
}))

/**
 * @typedef {Object} UserInfoProps
 * @property {string} email
 */

/**
 * @type {React.FunctionComponent<UserInfoProps>}
 */
const UserInfo = ({ email }) => {
  const classes = useStyles()

  const user = useHttpClient({
    endpoint: getDataEndpoint,
    queries: {
      email
    },
    method: GET,
    requiresAuth: true
  })

  const [expanded, setExpanded] = useToggler()

  return user.fetch ? (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {user.data.firstName[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={getFullName(user.data.firstName, user.data.lastName)}
        subheader={moment(user.data.createdAt).format('DD/MM/YYYY - HH:mm a')}
      />
      <FlexContainer>
      <CardMedia
        className={classes.media}
        image={user.data.imageUrl ? user.data.imageUrl : img.astronaut}
        title="Contemplative Reptile"
      />
      </FlexContainer>
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          <b className="text-blue">{user.data.email.toUpperCase()}</b>
          <br />
          <br />
          Última conexión: {moment(user.data.lastLogin).fromNow()}
          <br />
          <br />
          <Icon
            style={readOnlyStyles}
            className="text-blue mr-1"
            icon={ic_stars}
            size={20}
          />
          {user.data.model ? user.data.model.name.toUpperCase() : 'N/D'}
          <Icon
            className="text-blue ml-2 mr-1"
            icon={ic_library_music}
            size={20}
          />
          {user.data.speakings}
          <Icon className="text-blue ml-2 mr-1" icon={ic_mode_edit} size={20} />
          {user.data.writings}
          <br />
          <br />
          {user.data.membership && (
            <>
              <Icon style={readOnlyStyles} className="text-blue" icon={ic_verified_user} /> Membresía
            </>
          )}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={setExpanded}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent></CardContent>
      </Collapse>
    </Card>
  ) : (
    <FallbackMode />
  )
}

const getDataEndpoint = '/api/v1/admin/info-user'

const readOnlyStyles = {
  position: 'relative',
  bottom: 1
}

export default UserInfo
