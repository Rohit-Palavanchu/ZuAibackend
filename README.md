Here's a README file based on your provided file structure and API details:

---

# ZuAi Backend

## Overview

ZuAi is a backend service for managing blog posts with user authentication. This application includes functionalities for user registration, login, and CRUD operations on blog posts. It is designed using Node.js and SQLite as the database.

## Project Structure

```
c:/My Projects/ZuAi/ZuAibackend/
  ├─ models/
  │  └─ db.js          # Database connection and setup
  ├─ routes/
  │  ├─ authRoutes.js  # Routes for user authentication (login, register)
  │  └─ blogRoutes.js  # Routes for managing blog posts
  ├─ .gitignore        # Specifies files and directories to ignore in version control
  ├─ app.http          # HTTP requests for testing the API
  ├─ app.js            # Main application file
  ├─ blogs.db          # SQLite database file
  ├─ package-lock.json # Package lock file for exact dependency versions
  └─ package.json      # Project metadata and dependencies
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd ZuAibackend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   The SQLite database file `blogs.db` will be automatically created.

4. **Start the server:**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

### 1. Get All Posts

- **Endpoint:** `GET /blogs/posts`
- **Content-Type:** `application/json`

### 2. Get a Specific Post

- **Endpoint:** `GET /blogs/posts/:id`
- **Content-Type:** `application/json`

### 3. Get Posts Based on Logged-in User

- **Endpoint:** `GET /blogs/userposts`
- **Content-Type:** `application/json`
- **Headers:**
  - `Authorization: Bearer <token>`

### 4. Login a User

- **Endpoint:** `POST /blogs/login`
- **Content-Type:** `application/json`
- **Request Body:**

   ```json
   {
       "username": "rohan",
       "password": "rohan@2001"
   }
   ```

### 5. Register a User

- **Endpoint:** `POST /blogs/register`
- **Content-Type:** `application/json`
- **Request Body:**

   ```json
   {
       "username": "rohan",
       "password": "rohan@2001"
   }
   ```

### 6. Post a Blog (with User Authentication)

- **Endpoint:** `POST /blogs/posts`
- **Content-Type:** `application/json`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**

   ```json
   {
     "title": "My First Updated Blog Post",
     "content": "This is the content of my first blog post."
   }
   ```

### 7. Edit a Blog (with User Authentication)

- **Endpoint:** `PUT /blogs/posts/:id`
- **Content-Type:** `application/json`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**

   ```json
   {
     "title": "Updated Blog Post Title",
     "content": "This is the updated content for the blog post."
   }
   ```

### 8. Delete a User (with User Authentication)

- **Endpoint:** `DELETE /blogs/posts/:id`
- **Content-Type:** `application/json`
- **Headers:**
  - `Authorization: Bearer <token>`

## Testing

The `app.http` file includes HTTP requests for testing the API. You can use tools like Postman or HTTP clients in code editors (e.g., VS Code) to execute these requests.

## License

This project is licensed under the MIT License.

---

Feel free to adjust any sections to better fit your project's needs or add any additional details you think are necessary!
