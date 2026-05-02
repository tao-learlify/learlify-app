import { useSelector } from 'react-redux'
import { languagesSelector } from 'store/@selectors/languages'

function useLanguages () {
  const languages = useSelector(languagesSelector)

  return languages
}

export default useLanguages