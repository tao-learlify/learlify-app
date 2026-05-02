/**
 * 
 * @param {string} languages 
 * @param {string} competences 
 */
export default function validateFormClasses (languages, competences) {
  return languages.trim() === '' || competences.trim() === '' 
}

