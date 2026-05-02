import { useSelector } from 'react-redux'

import { settingsSelector, networkSelector } from 'store/@selectors/settings'

/**
 * @returns {import('store/@reducers/settings').SettingsState}
 */
export default function useSettings ({ network } = { network: false }) {
  const settings = useSelector(network ? networkSelector : settingsSelector) 

  return settings
}