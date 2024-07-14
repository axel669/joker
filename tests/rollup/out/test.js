const number_$ = item => typeof item !== "number";
const string_$ = item => typeof item !== "string";
var validate = (item) => {
    const errors = [];
    if (Array.isArray(item) === false) {
        errors.push({message: `item is not an array`, type: "[internal] array", path: `item`, value: item});
    }
    else {
        for (let source = item, index0 = 0; index0 < source.length; index0 += 1) {
            const item0 = source[index0];
            if (typeof item0 !== "object" || item0 === null) {
                errors.push({message: `item[${index0}] is not an object`, type: "[internal] object", path: `item[${index0}]`, value: item0});
            }
            else {
                if (number_$(item0.id)) {
                    errors.push({message: `item[${index0}].id is not a number`, type: "number.$", path: `item[${index0}].id`, value: item0.id});
                }
                if (item0.name !== null && item0.name !== undefined) {
                    if (string_$(item0.name)) {
                        errors.push({message: `item[${index0}].name is not a string`, type: "string.$", path: `item[${index0}].name`, value: item0.name});
                    }
                }
            }
        }
    }
    return errors.length ? errors : true
};

const data = [
    { id: 1 },
    { id: 2, name: "test" },
    { id: 3, name: 10 },
    { id: 4 },
];

console.log(
    validate(data)
);
