import { courseConfig } from '@/config/course-config';
import { useEffect } from 'react';

/**
 * Sets the meta tag with the given name and content. If a meta tag with the
 * same name already exists, its content is updated. If not, a new meta tag
 * is created and appended to the document head.
 *
 */
function setMeta(tagName: string, content?: string) {
  if (!content) return;
  const head = document.head || document.getElementsByTagName('head')[0];
  let tag = head.querySelector<HTMLMetaElement>(`meta[name="${tagName}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', tagName);
    head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function MetaTags() {
  const siteName = courseConfig.title;
  const courseDescription = courseConfig.description;
  const courseKeywords = courseConfig.keywords.join(',');
  const courseAuthor = courseConfig.author;
  const courseOrganization = courseConfig.organization;

  useEffect(() => {
    document.title = siteName as string;
    // Basic meta tags
    setMeta('description', courseDescription);
    setMeta('keywords', courseKeywords);
    setMeta('author', courseAuthor);
    setMeta('organization', courseOrganization);
  }, [siteName, courseDescription, courseKeywords, courseAuthor, courseOrganization]);

  return null;
}
