## Documentation on some aspects of development

### Some details abot the Submit Form (/submit)

- Utilizing shadcn Form guidlines which includes using zod as a form validator.
- To enable suggestions/autocomplete for users when typing in the form, requests are made to the backend to retrieve the suggestions.
    - I implemented a reusable hook called useFetchFieldData(endpoint: string) which can be reused to fetch all the different suggestions for the input fields
    - So, when the salaryForm component gets called -> utilizes the hooks to retrieve the different suggestions -> feeds that into a reusable input component which then displays the suggestions when a user types.
