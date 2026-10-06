import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    priceType: {
      type: String,
      default: 'Request a Quote',
    },
    price: {
      type: String,
      default: 'Variable',
    },
    currency: {
      type: String,
      enum: ['USD', 'PKR'],
      default: 'USD',
    },
    image: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
