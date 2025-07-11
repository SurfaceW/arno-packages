export function htmlToTextContent(html: string): string {
  // Input validation
  if (typeof html !== 'string') {
    throw new Error('Input must be a string');
  }

  // Handle empty or null input
  if (!html || html.trim() === '') {
    return '';
  }

  try {
  // Create a temporary DOM element to hold the HTML content
    const tempElement = document.createElement('div');

    // Set the innerHTML of the temporary element to the provided HTML
    tempElement.innerHTML = html;

    // Use textContent to extract the plain text from the temporary element
    const textContent = tempElement.textContent || tempElement.innerText || '';

    return textContent.trim();
  } catch (error) {
    // Fallback: return original string if DOM manipulation fails
    console.warn('Failed to parse HTML, returning original string:', error);
    return html;
  }
}