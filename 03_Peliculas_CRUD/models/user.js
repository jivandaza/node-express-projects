import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
        role: { type: String, enum: ['admin', 'user'], required: true },
        username: { type: String, required: true,  },
        email: { type: String, required: true },
        password: { type: String, required: true }
});

UserSchema.pre('save', function (next) {

    if (this.isNew || this.isModified('password')) {
        const document = this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {

            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        })
    } else {
        next();
    }
});

UserSchema.methods.isCorrectPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, function (err, same) {
            if (err) {
                reject(err);
            } else {
                resolve(same);
            }
        });
    });
};
export default mongoose.model('User', UserSchema);