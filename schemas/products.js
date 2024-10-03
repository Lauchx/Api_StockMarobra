const zod = require('zod')

const stockSchema = zod.object({
    quantity: zod.number().positive({
        message: "Quantity must be a positive number"
    }),
    outbound: zod.number().default(0),
    inbound: zod.number().default(0),

});
const productSchema = zod.object({
    name: zod.string({
        invalid_type_error: "Product name must be a string",
        require_error: "Name is required"
    }),
    width: zod.number().positive({
        message: "Width must be a positive number"
    }),
    height: zod.number().positive({
        message: "Height must be a positive number"
    }),
    length: zod.number().positive({
        message: "Weight must be a positive number"
    }),
    stock: stockSchema,
})

function validateProduct(object) {
    stockSchema.safeParse(object);
    return productSchema.safeParse(object)
}
module.exports = {
    validateProduct
}