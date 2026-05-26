import mongoose from "mongoose";
import Page from "../models/Page.ts";
import Project from "../models/Project.ts";

interface CreateProjectData {
  title: string;
  slug: string;
  cover?: string;
  userId: string | mongoose.Types.ObjectId;
  groupId?: string | mongoose.Types.ObjectId | null;
}

/**
 * Creates a project and its first default page.
 * Reused by createProject and duplicateProject.
 * Returns { project, page } on success, throws Error on failure.
 */
export const createProjectWithPage = async (
  data: CreateProjectData,
  firstPage?: { title?: string; slug: string; puckData: object }
) => {
  let project;
  let page;

  try {
    project = await Project.create({
      ...data,
      groupId: data.groupId ?? null,
      version: 1,
      deletedAt: null,
    });

    page = await Page.create({
      title: firstPage?.title ?? "Página Klyro",
      slug: firstPage?.slug ?? `page-${Date.now()}`,
      order: 1,
      puckData: firstPage?.puckData ?? {},
      projectId: project._id,
      deletedAt: null,
    });
  } catch (err) {
    // If page creation failed but project was created, clean up
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
 */
export const duplicateProjectWithPages = async (projectId: string) => {
  const [original, pages] = await Promise.all([
    Project.findById(projectId),
    Page.find({ projectId }).sort({ order: 1 }),
  ]);

  if (!original) return null;

  const { project: newProject } = await createProjectWithPage(
    {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      cover: original.cover,
      userId: original.userId,
      groupId: original.groupId ?? null,
    },
    pages.length > 0
      ? { title: pages[0].title, slug: pages[0].slug, puckData: pages[0].puckData }
      : undefined
  );

  // Insert remaining pages (skip first, already created above)
  if (pages.length > 1) {
    await Page.insertMany(
      pages.slice(1).map(({ title, slug, type, order, puckData }) => ({
        title,
        slug,
        type,
        order,
        puckData,
        projectId: newProject._id,
        deletedAt: null,
      }))
    );
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
