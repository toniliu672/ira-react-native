// lib/stringUtils.ts
export const cleanHtml = (html: string): string => {
    if (!html) return '';
    return html
      .replace(/<[^>]+>/g, '\n')  // Ganti tag dengan newline
      .replace(/&nbsp;/g, ' ')    // Handle spasi
      .replace(/&amp;/g, '&')     // Handle ampersand
      .replace(/&quot;/g, '"')    // Handle quote
      .replace(/&lt;/g, '<')      // Handle less than
      .replace(/&gt;/g, '>')      // Handle greater than
      .replace(/\n\s*\n/g, '\n')  // Handle multiple newlines
      .trim();
  };