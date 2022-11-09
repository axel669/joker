const buildType = (name, base, ...optional) => {
    const type = (options) => {
        const typedef = (name) => [
            base(name),
            ...optional
                .filter(
                    ([prop]) => (
                        options !== undefined
                        && options[prop] !== undefined
                    )
                )
                .map(
                    ([prop, func]) => func(name, options[prop])
                )
        ].map(expr => `(${expr})`)
            .join(" || ")
        typedef.typeName =
            (options !== undefined)
                ? `${name}(${JSON.stringify(options)})`
                : name
        return typedef
    }

    return type
}

const builtin = {
    number: buildType(
        "number",
        (name) => `typeof ${name} !== "number"`,
        ["min", (name, value) => `${name} < ${value}`],
        ["max", (name, value) => `${name} > ${value}`],
    ),
    string: buildType(
        "string",
        (name) => `typeof ${name} !== "string"`,
        ["min", (name, value) => `${name}.length < ${value}`],
        ["max", (name, value) => `${name}.length > ${value}`],
        ["length", (name, value) => `${name}.length !== ${value}`]
    ),
    bool: buildType(
        "boolean",
        (name) => `typeof ${name} !== "boolean"`
    ),
    int: buildType(
        "int",
        (name) => `typeof ${name} !== "number" || (${name} % 1) !== 0`,
        ["min", (name, value) => `${name} < ${value}`],
        ["max", (name, value) => `${name} > ${value}`],
    )
}

export { builtin, buildType }
