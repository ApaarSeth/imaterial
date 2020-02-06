export const FieldRegExConst = {
    EMAIL: /^(([^+=\'~`\^\/!#$%&*<>(){}\[\]\.,;:\s@\"\\\\]+(\.[^+=\'~`\^\/!#$%&*<>(){}\[\]\.,;:\s@\"\\\\"]+)*)|(\".+\"))@(([^+=\'~`\^\/!#$%&*<>(){}\[\]\.,;:\s@\"\\\\]+\.)+[^+=\'~`\^\/!#$%&*<>(){}\[\]\.,;:\s@\"\\\\-_"]([a-z0-9]{1,}))$/i,
    PHONE: '[1-9]{1}[0-9]{9}',
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    NAME: '[a-zA-Z ]*',
    POSITIVE_NUMBERS: '[0-9]+',
    CARD_NUMBER: '[0-9 ]+',
    EMAIL_OR_PHONE: '/^((.+@.+\\..+)|[1-9]{1}[0-9]{9})$/',
    GSTIN : /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
    MOBILE : /^[6-9]\d{9}$/,
    LANDLINE : /^[0-9]\d{2,4}\d{6,8}$/,
    PINCODE: /^[1-9]{1}[0-9]{5}$/
};