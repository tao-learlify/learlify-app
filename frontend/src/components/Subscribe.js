import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class YouTubeSubscribe extends PureComponent {
  static propTypes = {
    channelName: PropTypes.string,
    channelid: PropTypes.string.isRequired,
    theme: PropTypes.string,
    layout: PropTypes.string,
    count: PropTypes.string
  }

  static defaultProps = {
    channelName: '',
    channelid: 'UCNlCF9dH_nGvpap6ROdlQuQ',
    theme: 'full',
    layout: 'default',
    count: 'default'
  }

  constructor(props) {
    super(props)

    this.youtubeSubscribeNode = React.createRef()

    this.state = {
      initialized: false
    }
  }

  initialized() {
    this.setState({
      initialized: true
    })
  }

  componentDidMount() {
    if (this.state.initialized) {
      return
    }

    const youtubescript = document.createElement('script')

    youtubescript.src = 'https://apis.google.com/js/platform.js'

    this.youtubeSubscribeNode.current.parentNode.appendChild(youtubescript)

    this.initialized()
  }
  render() {
    const { theme, layout, count, channelName, channelid } = this.props

    return (
      <section className="youtubeSubscribe">
        <div
          ref={this.youtubeSubscribeNode}
          className="g-ytsubscribe"
          data-theme={theme}
          data-layout={layout}
          data-count={count}
          data-channel={channelName}
          data-channelid={channelid}
        />
      </section>
    )
  }
}
