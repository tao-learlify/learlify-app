import React, { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from 'components/ui'

import Template from 'components/Template'
import Text from 'components/Text'


import { img } from 'assets/compat'
import { BLUE, WHITE } from 'assets/colors'
import 'assets/css/error404.css'
import PATH from 'utils/path'


const Error404 = () => {
  const history = useHistory()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    document.body.style.backgroundColor = BLUE;

    return () => {  
      document.body.style.backgroundColor = WHITE;
    } 
  }, []);

  const pageNotFoundMessage = t('ERRORS.notFound')

  const goToDashboardMessage = t('ERRORS.goIndex')

  return (
    <Template withNavbar={false} view>
      <hr />
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3">
          <div className="flex justify-center">
            <img alt="alien" src={img.alien} />
          </div>
          <br />
          <br />
          <div className="flex justify-center">
            <Button size="lg" onClick={() => history.push(PATH.DASHBOARD)}>
              {goToDashboardMessage}
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3 flex justify-center items-center text-white">
          <Text center tag="h4">
            {pageNotFoundMessage} :(
          </Text>
          <br />
        </div>
      </div>
    </Template>
  )
}

export default Error404
