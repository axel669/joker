import * as joker from "@axel669/joker"

// stolen live on stream from OdatNurd
/* Extend the types of values known to Joker validation.
 *
 * In the list, the validation functions should return true if the data is not
 * valid and false if it is; or if you will, it is returning whether or not the
 * validator should raise an error or not. */
joker.extendTypes({
    // Validate that the nanoid is a string of the appropriate length and
    // character composition.
    "nanoid.$": (item) => true,
})

/* Extend the error messages that are reported for custom validations. */
joker.extendErrors({
    // Generically, we can only tell if the naoid is valid or not.
    "nanoid.$": (id) => `${id} is not a valid nanoid`,
});
