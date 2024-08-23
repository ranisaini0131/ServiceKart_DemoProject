import Joi from "joi"

export const phone_number_validation = Joi.object({
    phone_number: Joi.string().min(10).max(10).required(),

});

export const userSchema = Joi.object({
    phone_number: Joi.string().min(10).max(10).required(),
    first_name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    DOB: Joi.date().required(),
    gender: Joi.string().required()
});


export const loginUser = Joi.object({
    phone_number: Joi.string().min(10).max(10).required()
});

export const updateProfileValidation = Joi.object({
    user: Joi.number().required(),
    phone_number: Joi.string().min(10).max(10),
    first_name: Joi.string().max(30),
    last_name: Joi.string().max(30),
    email: Joi.string().email(),
    DOB: Joi.date(),
    gender: Joi.string()
});


export const addAddressValidation = Joi.object({
    user: Joi.number().required(),
    area: Joi.string().required(),
    landmark: Joi.string().required(),
    person_name: Joi.string().required(),
    address_type: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
})

export const updateAddressValidation = Joi.object({
    user: Joi.number().required(),
    area: Joi.string().required(),
    landmark: Joi.string().required(),
    person_name: Joi.string().required(),
    address_type: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required()
});

export const updateAddressStatusValidation = Joi.object({
    user: Joi.number().required(),
    status: Joi.number().required(),
    addressId: Joi.number().required()
});

export const savedCardsValidation = Joi.object({
    user: Joi.number().required(),
    card_number: Joi.number().min(10).max(10).required(),
    cvv: Joi.number().min(5).max(5).required(),
    card_type: Joi.string().required(),
    valid_upto: Joi.string().required(),
    person_name: Joi.string().required()
})

export const updateCardValidation = Joi.object({
    user: Joi.number().required(),
    card_number: Joi.number().required(),
    cvv: Joi.number().required(),
    card_type: Joi.string().required(),
    valid_upto: Joi.string().required(),
    person_name: Joi.string().required()
});


export const updateCardStatusValidation = Joi.object({
    user: Joi.number().required(),
    status: Joi.number().required(),
    cardId: Joi.number().required()

});

export const addProductToCartValidation = Joi.object({
    user: Joi.number().required(),
    product_reference_id: Joi.number().required(),
    quantity: Joi.number().required()
})

export const updateProductStatusValidation = Joi.object({
    user: Joi.number().required(),
    status: Joi.number().required(),
    productId: Joi.number().required()
})

export const placeOrderValidation = Joi.object({
    user: Joi.number().required(),
    total_amount: Joi.number().required(),
    shipping_address: Joi.number().required(),
    order_details: Joi.array().items(
        Joi.object({
            product_reference_id: Joi.number().required(),
            price: Joi.number().required(),
            tax: Joi.number().required(),
            quantity: Joi.number().required()
        })
    ).required()
});



export const cancelOrderValidation = Joi.object({
    user: Joi.number().required(),
    orderId: Joi.number().required(),
    reasonOfCancellation: Joi.string().required()
})

export const updateOrderStatusValidation = Joi.object({
    user: Joi.number().required(),
    status: Joi.number().required(),
    orderId: Joi.number().required()
})