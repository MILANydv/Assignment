import mongoose from 'mongoose';
  
const businessSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, unique: true },
      slug:{type: String, required:true, unique:true},
      countInstock: {type: Number, required: true, unique: true},
      image: { type: String, required: true },
      address: { type: String, required: true , unique:true},
      description: { type: String, required: true , unique:true},
    },
    {
      timestamps: true,
    }
);
  
const Business = mongoose.model('Business', businessSchema);
export default Business;
  