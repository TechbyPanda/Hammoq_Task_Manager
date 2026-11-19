# Hammoq Task Manager Backend

## Commands
1. To run app on dev `npm run dev -w backend`

## Libraries
The libraries which i used in my backend.

### Express
Express to create backend server.

### Cors
By defaul browsers block cross-origin requests unless the server explicitly allows them via HTTP response headers like `Access-Control-Allow-Origin`.
`cors` automatically adds those required headers so the browser lets the request through.

### Cookie parser
Parses the cookie header into req.cookies so the auth middelware can read the JWT from an httpOnly cookie. - on dev

### JSON webtoken
Issues a signed token at sign-in (expires in 1 day) and verifies its signature with JWT_SECRET on each request. I chose JWT over server-side sessions to keep the API stateless, so it can scale horizontally without a shared session store like Redis.

### Mongoose
To connect with mongodb atlas.

### Zod
validates request body, params and query at the API boundary. It rejects bad input with a 400, drops unwanted fields, and blocks NoSQL operator injection.