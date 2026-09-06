import { Schema, model } from 'mongoose';

export const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

const Session = model('Session', sessionSchema);
export { Session };
