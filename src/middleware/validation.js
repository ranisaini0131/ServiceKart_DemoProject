import Joi from "joi"

export const phone_number_validation = Joi.object({
    phone_number: Joi.string().min(10).max(30).required(),

});

export const userSchema = Joi.object({
    user: Joi.number().required(),
    phone_number: Joi.string().min(10).max(30).required(),
    first_name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    DOB: Joi.date().required(),
    gender: Joi.string().required()
});


export const loginUser = Joi.object({
    phone_number: Joi.string().min(10).max(30).required()
});

export const updateProfileValidation = Joi.object({
    user: Joi.number().required(),
    phone_number: Joi.string().min(10).max(30).required(),
    first_name: Joi.string().max(30).required(),
    last_name: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    DOB: Joi.date().required(),
    gender: Joi.string().required()
});

export const addAddressValidation = Joi.object({
    user: Joi.number().required(),
    area: Joi.string().required(),
    landmark: Joi.string().required(),
    person_name: Joi.string().required(),
    address_type: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    user_reference_id: Joi.string().required()
})

export const updateAddressValidation = Joi.object({
    user: Joi.number().required(),
    area: Joi.string().required(),
    landmark: Joi.string().required(),
    person_Name: Joi.string().required(),
    address_Type: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    user_reference_id: Joi.string().required()
})

export const deleteAddressValidation = Joi.object({
    user: Joi.number().required(),
})

export const savedCardsValidation = Joi.object({
    user: Joi.number().required(),
    card_number: Joi.number().required(),
    cvv: Joi.number().required(),
    card_type: Joi.string().required(),
    valid_upto: Joi.string().required(),
    person_name: Joi.string().required(),
    user_reference_id: Joi.number().required()
})


export const deleteCardValidation = Joi.object({
    user: Joi.number().required(),
    card_number: Joi.string().required(),
    cvv: Joi.string().required(),
    card_type: Joi.string().required(),
    valid_upto: Joi.string().required(),
    person_name: Joi.string().required(),
    user_reference_id: Joi.number().required()
})


export const updateCardValidation = Joi.object({
    user: Joi.number().required(),
    card_number: Joi.number().required(),
    cvv: Joi.number().required(),
    card_type: Joi.string().required(),
    valid_upto: Joi.string().required(),
    person_name: Joi.string().required(),
    user_reference_id: Joi.number().required()
})


export const addProductToCartValidation = Joi.object({
    user: Joi.number().required(),
    product_reference_id: Joi.number().required(),
    quantity: Joi.number().required()
})

export const placeOrderValidation = Joi.object({
    user: Joi.number().required(),
    product_reference_id: Joi.number().required(),
    price: Joi.required(),
    tax: Joi.required(),
    shipping_address: Joi.string().required(),
    order_details: [
        {
            order_reference_id: Joi.number().required(),
            product_reference_id: Joi.number().required(),
            price: Joi.required(),
            tax: Joi.required(),
        }
    ]
})

