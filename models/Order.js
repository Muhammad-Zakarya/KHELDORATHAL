import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: String,
      required: [true, 'Please select or specify a service'],
    },
    projectTitle: {
      type: String,
      required: [true, 'Please provide a project title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide project details'],
    },
    budget: {
      type: String,
      required: [true, 'Please specify your budget'],
    },
    currency: {
      type: String,
      enum: ['USD', 'PKR'],
      default: 'USD',
    },
    deadline: {
      type: String,
      default: 'Flexible',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
