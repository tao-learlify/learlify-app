export const ModuleValidaton = {
  /**
   * @param {[]} validation
   * @param {{}} form
   */
  apply(validation, form) {
    const value = validation(form)

    return value.validation
  },

  /**
   * @param {{ validation?: { }}} validation
   */
  isValid(validation) {
    return validation === -1
  }
}
