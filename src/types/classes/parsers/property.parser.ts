export type Parameters<T = string> = {
    [key: string]: T
}

interface IPropertyParser<Property> {
    parse(value: string): Property
}

export default IPropertyParser
