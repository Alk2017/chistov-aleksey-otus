const random = require("./utils");
const {Schema, model} = require("mongoose")

const schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        description: {
            type: String,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        links: {
            type: [String]
        },
        files: {
            type: [String]
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

schema.index(
    { authorId: 1, name: 1},
    { unique: true }
);

const Lesson = model("Lesson", schema);
module.exports = {Lesson};