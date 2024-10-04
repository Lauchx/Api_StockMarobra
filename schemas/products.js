const zod = require('zod')

const stockSchema = zod.object({
    quantity: zod.number().positive({
        message: "Quantity must be a positive number"
    }).min(0, 'Quantity is required'),
    outbound: zod.number().default(0),
    inbound: zod.number().default(0),

});
const productSchema = zod.object({
    name: zod.string({
        invalid_type_error: "Product name must be a string",
        require_error: "Name is required"
    }).min(1, 'Product name is required'),

    width: zod.number().positive({
        message: "Width must be a positive number"
    }).min(0, 'Width is required'),

    height: zod.number().positive({
        message: "Height must be a positive number"
    }).min(0, 'Height is required'),

    length: zod.number().positive({
        message: "Weight must be a positive number"
    }).min(0, 'Length is required'),
    stock: stockSchema,
})

function validateProduct(object) {
    stockSchema.safeParse(object);
    return productSchema.safeParse(object)
}
module.exports = {
    validateProduct
}