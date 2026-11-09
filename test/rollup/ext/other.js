import { extendTypes } from "@axel669/joker"

extendTypes({
    //  Define when the item is bad
    //  typeName.$ is the base type validator that runs regardless of any params
    //  that get passed in. typeName.paramName allows for validating custom
    //  params on a type.
    "string-number.$": (item) => (
        typeof item !== "string"
        && typeof string !== "number"
    ),
    "string-number.nan": (item, isnan) => isNaN(item) !== isnan
})
