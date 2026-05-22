import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PageSchema = new mongoose.Schema({
  // Title from page
  title: {
    type: String,
    default: 'Página Klyro'
  },

  // For use in routes to wotk with pagination
   slug: {
    type: String,
    required: true
  },

  // Extra, maybe useful at future
  type: {
    type: String,
    default: 'landing',
    enum: ['landing']
  },

  // Order to pagination
  order: {
    type: Number,
    required: true
  },

  // Heavy data from Puck
  puckData: {
    type: Object,
    required: true
  },

  // Page N:1 Project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

  // Soft delete — set when project is moved to trash
  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// Compound index to fetch pages of a project in order
PageSchema.index({ projectId: 1, order: 1 });

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not defined');
}

mongoose.connect(mongoUri, {
  autoIndex: true
});
export default mongoose.model("Page", PageSchema);
