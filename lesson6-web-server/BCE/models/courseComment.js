const random = require("./utils");
const {Schema, model} = require("mongoose")

const schema = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            select: false
        },
        comment: {
            type: String,
            required: true,
        },
    }, {
        timestamps: true,
        toJSON: {
            versionKey: false,
        }
    }
);

schema.virtual('author', {
    ref: 'User',
    localField: 'autorId',
    foreignField: '_id',
    justOne: true
});

schema.index(
    { authorId: 1, createdAt: 1},
    { unique: true }
);


const CourseComment = model("CourseComment", schema);
module.exports = {CourseComment};