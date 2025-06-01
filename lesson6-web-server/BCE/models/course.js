const random = require("./utils");
const {Schema, model} = require("mongoose")

const courseSchema = new Schema(
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
        tags: {
            type: [String]
        },
        difficulty: {
            type: String,
            enum: ['EASY', 'MEDIUM', 'HARD'],
            default: 'MEDIUM'
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
        },
        lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        students: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }, {
        toJSON: {
            versionKey: false,
        }
    }
);

courseSchema.index(
    { authorId: 1, name: 1},
    { unique: true }
);

const Course = model("Course", courseSchema);
module.exports = {Course};