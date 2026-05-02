import React, { Fragment, useMemo } from "react"

import { createPicks } from "utils/courses"


function useCloudfrontUtils () {
  const fn = useMemo(() => ({
    /**
     * @param {JSON} cloudfrontJSON
     * @returns {React.ReactElement} 
     */
    getTotalUnits (cloudfrontJSON) {
      if (!Object(cloudfrontJSON).hasOwnProperty('units')) {
        return <Fragment />
      }

      const { units } = cloudfrontJSON

      return createPicks(units, null)
    },


    getSectionOrder (cloudfrontJSON, index) {
      const sections = cloudfrontJSON.views.map(view => {
        return view.sections.map(section => ({
          category: section.content.map(value => ({
            type: section.type,
            as: section.as
          }))[0].as
        }))
      })

      return sections[index]
    }
  }), [])

  return fn
}

export default useCloudfrontUtils