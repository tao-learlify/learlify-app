import Joi, { type SchemaLike, type SchemaMap } from 'joi'

type ValidatorType = 'string' | 'number' | 'boolean'

type TransformParams = {
  value?: unknown
  type: ValidatorType
}

type PipeValue = {
  value: number | string | boolean
  type: ValidatorType
}

export class Validator {
  static schema(body: unknown, schemaLike: SchemaLike): unknown {
    return Joi.validate(body, schemaLike)
  }

  static createSchema(keys: SchemaMap): unknown {
    return Joi.object().keys(keys)
  }

  static get accessLibrary() {
    return Joi
  }

  static get types(): Record<ValidatorType, ValidatorType> {
    return {
      number: 'number',
      string: 'string',
      boolean: 'boolean'
    }
  }

  static transform({ value, type }: TransformParams): PipeValue | PipeValue[] | unknown {
    const isArray = Array.isArray(value)

    switch (type) {
      case 'number':
        return isArray
          ? value.map(pipe => ({
              value: Number.parseInt(pipe as unknown as string),
              type: 'number'
            }))
          : {
              value: Number.parseInt(value as unknown as string),
              type: 'number'
            }

      case 'string':
        return isArray
          ? value.map(pipe => ({
              value: (pipe as { toString(): string }).toString(),
              type: 'string'
            }))
          : {
              value: (value as { toString(): string }).toString(),
              type: 'string'
            }

      case 'boolean':
        return {
          value: Boolean(value),
          type: 'boolean'
        }

      default:
        return value
    }
  }

  static through({ value, type }: TransformParams): boolean | undefined {
    const isArray = Array.isArray(value)

    if (type === 'number') {
      return isArray
        ? value.every(pipe => {
            const parsed = (pipe as { value: unknown }).value
            return typeof parsed === 'number' && !Number.isNaN(parsed)
          })
        : typeof value === 'number' && !Number.isNaN(value)
    }

    if (type === 'string') {
      return typeof value === 'string'
    }

    if (type === 'boolean') {
      return typeof value === 'boolean'
    }

    return undefined
  }
}
