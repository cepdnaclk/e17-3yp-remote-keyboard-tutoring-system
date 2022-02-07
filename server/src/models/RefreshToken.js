const mongoose = require('mongoose');   // imports mongoose
const Schema = mongoose.Schema;         // defines the strcuture of documents inside a collection

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date , index: { expires: '1d' } },
    createdByIP: { type: String, required: true },
    revokedAt: { type: Date },
    revokedByIP: { type: String },
    replacedByToken: { type: String }
});

schema.virtual('isExpired').get(function () {
    return this.expiresAt < Date.now();
});

schema.virtual('isActive').get(function () {
    return !this.revokedAt && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', schema);