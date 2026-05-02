export const ModuleRegExp = {
  intercept: new RegExp(/({x})/, 'gi'),
  space: new RegExp(/({v})/, 'gi'),
  numbers: new RegExp(/\d+/g)
}