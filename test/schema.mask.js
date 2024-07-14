const objValue0 = (source) => {
    if (source === null) {
        return null
    }
    if (source === undefined) {
        return undefined
    }
    const obj = {}
    for (const [key0, value0] of Object.entries(source)) {
        obj[key0] = {
            name: value0.name,
        }
    }
    return obj
}
export default (source) => {
    return {
        id: source.id,
        thing: source.thing,
        nested: {
            tagged: source.nested.tagged,
        },
        wat: source.wat.map( (source) => {
             return {
                name: source.name,
                count: source.count,
            }
        }),
        tags: source.tags.map( (source) => {
             return source
        }),
        funcs: objValue0(source.funcs),
    }
}
