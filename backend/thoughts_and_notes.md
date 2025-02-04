### Single vs multiple endpoints when building RESTful APIs

#### Multiple Endpoints (/company/allData, /company/average, /company/topLocation, /company/topUniversity)
##### Pros:

Separation of Concerns: Each endpoint has a single responsibility, making the code easier to maintain and test.

Flexibility: The frontend can request only the data it needs, reducing unnecessary data transfer.

Scalability: If one endpoint becomes heavily used, it can be scaled independently.

#####  Cons:

Increased Complexity: The frontend needs to make multiple requests, which can complicate the frontend logic.

Latency: Multiple network requests can increase latency, especially if the frontend needs to wait for all requests to complete.

#### Option B: Single Endpoint (/company)
##### Pros:

Simplicity: The frontend makes a single request, simplifying the frontend logic.

Reduced Latency: Only one network request is made, which can reduce latency.

#####  Cons:

Overfetching: The endpoint might return more data than needed, leading to unnecessary data transfer.

Complexity in Backend: The backend logic becomes more complex as it needs to handle multiple types of data retrieval in a single endpoint.

#### Best Practice Recommendation:
Recommendation: Use Option A (Multiple Endpoints) if the frontend needs flexibility and the data requirements are diverse. This approach aligns with RESTful principles and makes the API more maintainable and scalable.

Alternative: If the data requirements are always the same and the frontend always needs all the data, then Option B (Single Endpoint) might be more efficient.