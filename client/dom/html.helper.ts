export function htmlToTextContent(html: string) {
  // Create a temporary DOM element to hold the HTML content
  var tempElement = document.createElement('div');

  // Set the innerHTML of the temporary element to the provided HTML
  tempElement.innerHTML = html;

  // Use textContent to extract the plain text from the temporary element
  var textContent = tempElement.textContent || tempElement.innerText || '';

  return textContent;
}