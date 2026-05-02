import React, { memo, useEffect, useRef } from 'react'
import YouTubePlayer from 'react-youtube'
import Carousel from '@brainhubeu/react-carousel'
import { useDispatch } from 'react-redux'
import { Animated } from 'react-animated-css'
import { ReactSVG } from 'react-svg'



import useToggler from 'hooks/useToggler'
import useSVG from 'hooks/useSVG'
import useMedia from 'hooks/useMedia'
import useSettings from 'hooks/useSettings'


import FlexContainer from 'components/FlexContainer'
import ModalDialog from 'components/ModalDialog'
import Subscribe from 'components/Subscribe'

import styles from './index.module.scss'
import plugins from './plugins'

import Right from 'assets/svg/previous.svg'
import Left from 'assets/svg/next.svg'
import { fetchYoutubeVideosThunk } from 'store/@thunks/settings'

const Videos = () => {
  const dispatch = useDispatch()

  const isResponsive = useMedia('(max-width: 767px)', true)

  const svgCallback = useSVG({
    attributes: [['width', isResponsive ? 50 : 64]]
  })

  const videoRef = useRef()

  const { videos } = useSettings()

  const [toggled, handleToggle] = useToggler()

  useEffect(() => {
    dispatch(fetchYoutubeVideosThunk())
  }, [dispatch])

  /**
   * @param {{}} video
   */
  const handleVideoPreview = video => {
    videoRef.current = video

    handleToggle()
  }

  return (
    <>
      {videos && (
        <footer className={styles.background}>
          <div className={styles.container}>
            {videos &&
              (videos.error ? (
                <React.Fragment />
              ) : (
                <Carousel
                  addArrowClickHandler={true}
                  arrowLeft={
                    <Animated animationIn="fadeIn" animationOut="fadeOut">
                      <ReactSVG
                        beforeInjection={svgCallback}
                        className="hovered"
                        src={Right}
                      />
                    </Animated>
                  }
                  arrowRight={
                    <Animated animationIn="fadeIn" animationOut="fadeOut">
                      <ReactSVG
                        beforeInjection={svgCallback}
                        className="hovered"
                        src={Left}
                      />
                    </Animated>
                  }
                  arrowLeftDisabled={<React.Fragment />}
                  arrowRightDisabled={<React.Fragment />}
                  arrows
                  offset={5}
                  itemWidth={isResponsive ? 250 : 270}
                  plugins={plugins}
                  infinite
                >
                  {Array.isArray(videos) &&
                    videos.map(video => (
                      <img
                        alt="video"
                        className="hovered rounded border img-fluid"
                        key={video.etag}
                        src={video.snippet.thumbnails.medium.url}
                        width={240}
                        height={240}
                        onClick={() => handleVideoPreview(video)}
                      />
                    ))}
                </Carousel>
              ))}
          </div>
        </footer>
      )}
      <ModalDialog
        textHeader={
          videoRef.current ? videoRef.current.snippet.title : 'Untitled'
        }
        size="lg"
        enabled={toggled}
        onCloseRequest={handleToggle}
      >
        {videoRef.current && toggled && (
          <>
            <FlexContainer>
              <Subscribe />
            </FlexContainer>
            <FlexContainer>
              <YouTubePlayer
                videoId={videoRef.current.id.videoId}
                opts={YoutubeOptions}
              />
            </FlexContainer>
            <br />
            <p className="font-weight-bold text-muted text-center">
              {videoRef.current.snippet.description}
            </p>
          </>
        )}
      </ModalDialog>
    </>
  )
}

const YoutubeOptions = {
  height: 390,
  width: 640,
  playerVars: {
    autoplay: 1
  }
}

export default memo(Videos)
