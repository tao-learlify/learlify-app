import config from 'config'

const folders = {
  images: 'img'
}

/**
 * @type {string}
 */
const defaultFolder = config.CLOUDFRONT.concat('assets/')

const buildAsset = (folder, filename) =>
  defaultFolder.concat(folder, '/', filename)

export const assets = {
  images: {
    checked: buildAsset(folders.images, 'checked.png'),
    english: buildAsset(folders.images, 'english-language.png'),
    model: buildAsset(folders.images, 'model.png'),
    pandaTeaching: buildAsset(folders.images, 'panda-teaching.png'),
  }
}