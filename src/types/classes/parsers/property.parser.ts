export type Parameters<T = string> = {
    [key: string]: T | {name: T, lambda: Function}
}

interface IPropertyParser<Property> {
    parse(value: string): Property
}

export default IPropertyParser
