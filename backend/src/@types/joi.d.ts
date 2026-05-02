declare module 'joi' {
  export type SchemaLike = unknown
  export type SchemaMap = Record<string, unknown>

  interface JoiSchema {
    required(): JoiSchema
    optional(): JoiSchema
    allow(...args: unknown[]): JoiSchema
    valid(...args: unknown[]): JoiSchema
    min(...args: unknown[]): JoiSchema
    max(...args: unknown[]): JoiSchema
    email(...args: unknown[]): JoiSchema
    regex(...args: unknown[]): JoiSchema
    trim(): JoiSchema
    keys(keys: SchemaMap): JoiSchema
  }

  interface JoiSchemaObject {
    keys(keys: SchemaMap): unknown
  }

  interface JoiStatic {
    validate(body: unknown, schemaLike: SchemaLike): unknown
    object(): JoiSchemaObject
    string(): JoiSchema
    number(): JoiSchema
    boolean(): JoiSchema
  }

  const Joi: JoiStatic
  export default Joi
}
