export type InputParameters<T = string> = {
    [key: string]: T | {name: T, lambda: Function}
}

export type OutputParameters<T = string> = {
    [key: string]: T
}

interface IPropertyParser<Property> {
    parse(value: string): Property
}

export default IPropertyParser
