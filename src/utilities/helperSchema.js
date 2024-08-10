export const validateSchema = (schema, property) => {
    return (req, res, next) => {
        const params = req.body;
        const { error } = schema.validate(params);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(', ');
            res.send({
                "statusCode": 402,
                "statusMessage": message
            })
        }
    }
}

export const validateSchemaGet = (schema, property) => {
    return (req, res, next) => {
        const params = req.query;
        const { error } = schema.validate(params);
        const valid = error == null;
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            // const msg = message.replace(/[^a-zA-Z ]/g, "");
            res.send({
                "statusCode": 402,
                "statusMessage": message
            })
        }
    }
}