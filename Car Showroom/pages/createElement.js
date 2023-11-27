/**
 * Creates a new HTML element with specified properties and appends it to a parent element.
 *
 * @param {string} nameElement - The type of HTML element to create (e.g., 'div', 'span').
 * @param {string} idElement - The unique identifier for the created element.
 * @param {string} innerText - The text content to be set inside the created element.
 * @param {string} parentId - The id of the parent element to which the created element will be appended.
 * @returns {HTMLElement} - The created HTML element.
 */
export function CreateElement(nameElement, idElement, innerText, parentId) {
     let element = document.createElement(nameElement);
     element.id = idElement;
     element.innerText = innerText;
     if (parentId == "body")
          document.body.appendChild(element);
     else
          document.getElementById(parentId).appendChild(element);
     return element;
}