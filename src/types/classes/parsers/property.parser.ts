export type Parameters<T = string> = {
    // TODO: Solve this eslint error
    // eslint-disable-next-line @typescript-eslint/ban-types
    [key: string]: T | {name: T, lambda: Function}
}

interface IPropertyParser<Property> {
    parse(value: string): Property
}

export default IPropertyParser
