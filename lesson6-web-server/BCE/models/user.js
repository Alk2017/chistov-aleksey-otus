const {Schema, model} = require("mongoose")

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        role: {
            type: String,
            enum: ['ADMIN', 'AUTHOR', 'USER'],
            default: 'USER'
        },
        rating: {
            type: [Number],
            validate: {
                validator: (ratingArray) => {
                    return !ratingArray || (ratingArray.every(num => num > 0 && num <= 5));
                },
                message: (p) => { return `'${p.value}' should be between 1 and 5` },
            },
            default: []
        }
    }, {
        toJSON: {
            versionKey: false,
        }
    }
);

const User = model("User", userSchema);
module.exports = {User};