import mongoose from 'mongoose';

export interface UserReturnPayload {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  uuid: string;
}
