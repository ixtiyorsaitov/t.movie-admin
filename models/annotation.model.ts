import { IAnnotation } from "@/types/annotation";
import mongoose from "mongoose";

const AnnotationSchema = new mongoose.Schema<IAnnotation>(
  {
    subtitle: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ytUrl: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

const Annotation =
  mongoose.models.Annotation ||
  mongoose.model<IAnnotation>("Annotation", AnnotationSchema);

export default Annotation;
