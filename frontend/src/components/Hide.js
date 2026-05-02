import React, { memo, useCallback } from 'react'


/**
 * @typedef {Object} HideProps
 * @property {'All' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'} on
 * */

/**
 * @type {React.FunctionComponent<HideProps>}
 * */
const Hide = ({ children, on }) => {
	const getBlockProperty = useCallback(type => {
		switch(type) {
			case 'All': return 'd-none'

			case 'xs': return 'd-none d-sm-block'

			case 'sm': return 'd-sm-none d-md-block'

			case 'md': return 'd-md-none d-lg-block'

			case 'lg': return 'd-lg-none d-xl-block'

			case 'xl': return 'd-xl-none'

			default: return ''
		}
	}, [])

	return <div className={getBlockProperty(on)}>{children}</div>
}

export default memo(Hide)