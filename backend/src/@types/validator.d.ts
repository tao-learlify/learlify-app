declare module 'validator' {
  const validator: {
    isNumeric(str: string): boolean
    isUUID(str: string, version?: number): boolean
    isEmail(str: string): boolean
    isURL(str: string): boolean
    isInt(str: string): boolean
    isFloat(str: string): boolean
    isBoolean(str: string): boolean
    isJSON(str: string): boolean
    isEmpty(str: string): boolean
    isLength(str: string, options?: { min?: number; max?: number }): boolean
    [key: string]: unknown
  }
  export default validator
}
