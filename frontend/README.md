## Documentation on some aspects of development

### Some details abot the Submit Form (/submit)

- Utilizing shadcn Form guidlines which includes using zod as a form validator.
- To enable suggestions/autocomplete for users when typing in the form, requests are made to the backend to retrieve the suggestions.
    - I implemented a reusable hook called useFetchFieldData(endpoint: string) which can be reused to fetch all the different suggestions for the input fields
    - So, when the salaryForm component gets called -> utilizes the hooks to retrieve the different suggestions -> feeds that into a reusable 
    input component which then displays the suggestions when a user types.


#### Click outside detection pattern in the submit form:
    - It detects clicks outside a specific element using a ref and the contains method
    - Using ref: A way to directly reference a DOM element or store a mutable value in React.
    - Usage of it in suggestionInput.tsx:
        - The ref is attached to the outermost <div>.

        - A mousedown event listener is added to the document.

        - When a click occurs, the listener checks if the click is outside the referenced element.

        - If it is, the suggestions dropdown is hidden.

        - The useEffect removes the listener when the component is unmounted to prevent memory leaks