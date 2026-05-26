import mongoose from "mongoose";
import Page from "../models/Page.ts";
import Project from "../models/Project.ts";

interface CreateProjectData {
  title?: string;
  slug?: string;
  cover?: string;
  userId: string | mongoose.Types.ObjectId;
  groupId?: string | mongoose.Types.ObjectId | null;
}

/**
 * Creates a project and its first default page.
 * All fields are optional — schema defaults will fill in title, slug, cover, etc.
 * Returns { project, page } on success, throws Error on failure.
 */
export const createProjectWithPage = async (
  data?: CreateProjectData,
) => {
  let project;
  let page;

  try {
    project = await Project.create({
      ...data,
      groupId: data?.groupId ?? null,
      version: 1,
      deletedAt: null,
    });

    page = await Page.create({
      order: 1,
      puckData: {},
      projectId: project._id,
      deletedAt: null,
    });
  } catch (err) {
    if (project) {
      await Project.findByIdAndDelete(project._id);
    }
    throw err;
  }

  return { project, page };
};

/**
 * Updates a project and optionally its page.
 * Returns { project, page? } on success, throws Error on failure.
 */
export const updateProjectAndPage = async (
  projectId: string,
  projectData: Partial<{ title: string; slug: string; cover: string }>,
  pageId?: string,
  pageData?: Partial<{ title: string; slug: string; puckData: object }>
) => {
  // Project
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: { ...projectData, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );

  if (!project) {
    throw new Error('Project not found');
  }

  // Page
  if (pageId && pageData && Object.keys(pageData).length > 0) {
    const page = await Page.findByIdAndUpdate(
      pageId,
      { $set: { ...pageData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return { project, page };
  }

  return { project };
};

/**
 * Duplicates a project and all its pages.
 * All fields from the original are copied explicitly.
 */
export const duplicateProjectWithPages = async (projectId: string) => {
  const [original, pages] = await Promise.all([
    Project.findById(projectId),
    Page.find({ projectId, deletedAt: null }).sort({ order: 1 }),
  ]);

  if (!original) return null;

  let newProject;
  try {
    newProject = await Project.create({
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      cover: original.cover,
      userId: original.userId,
      groupId: original.groupId ?? null,
      version: original.version,
      deletedAt: null,
    });

    await Page.insertMany(
      pages.map(({ title, slug, type, order, puckData }) => ({
        title,
        slug,
        type,
        order,
        puckData,
        projectId: newProject._id,
        deletedAt: null,
      }))
    );
  } catch (err) {
    if (newProject) {
      await Project.findByIdAndDelete(newProject._id);
    }
    throw err;
  }

  return newProject;
};

/**
 * Updates multiple pages at once (e.g., for reordering).
 * Returns array of updated pages on success, throws Error on failure.
 */
export const updatePagesBulk = async (
  projectId: string,
  pages: Array<{ _id: string; order?: number; title?: string; slug?: string; puckData?: object }>
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const updatedPages = await Promise.all(
    pages.map(async (pageData) => {
      const update: any = { updatedAt: new Date() };
      if (pageData.order !== undefined) update.order = pageData.order;
      if (pageData.title !== undefined) update.title = pageData.title;
      if (pageData.slug !== undefined) update.slug = pageData.slug;
      if (pageData.puckData !== undefined) update.puckData = pageData.puckData;

      return Page.findByIdAndUpdate(
        pageData._id,
        { $set: update },
        { returnDocument: 'after' }
      );
    })
  );

  return updatedPages;
};
