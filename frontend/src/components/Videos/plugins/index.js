import { slidesToShowPlugin } from '@brainhubeu/react-carousel'


/**
 * @see https://brainhubeu.github.io/react-carousel/docs/plugins/plugins
 */
const plugins = [
  'arrows',
  {
    resolve: slidesToShowPlugin,
    options: {
      numberOfSlides: 1
    }
  }
]

export default plugins