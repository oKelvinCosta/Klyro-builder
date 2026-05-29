import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const ProjectSchema = new mongoose.Schema({
  // Project Title
  title: {
    type: String,
    default: () => `Untitled Project-${Date.now()}`
  },
  // For Routes
  slug: {
    type: String,
    default: () => `projeto-${Date.now()}`
  },

  // Versioning the macro project
  version: {
    type: Number,
    required: true
  },

  // Image Cover
  cover: {
    type: String,
    default: () => `https://api.dicebear.com/9.x/identicon/svg?seed=projeto-${Date.now()}`
  },
  // Theme configuration
  theme: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // Estilos de texto salvos (presets)
  textStyles: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },

  // Project N:1 User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Project N:1 Group
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    default: null
  },

  // Soft delete — set when moved to trash
  deletedAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// Índice composto para buscar projetos de um grupo em ordem
ProjectSchema.index({ groupId: 1, order: 1 });

// Índice para buscar projetos por usuário (se necessário no futuro)
ProjectSchema.index({ userId: 1 });

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not defined');
}

mongoose.connect(mongoUri, {
  autoIndex: true
});
export default mongoose.model("Project", ProjectSchema);
