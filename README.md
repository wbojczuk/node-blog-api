# node-blog-backend
<strong>Public Routes:</strong>
- api/blogs (GET) : Returns all blog metadata in blogdata.json.

- api/blogs/id/:id (GET) : Returns Blog matching :id.

- api/blogcontent/:id (GET) : returns HTML content of blog matching :id.

- api/blogs/latest (GET) : Returns metadata of 4 most recent blogs.

- api/blogs/categories (GET) : returns an array containing all existing blog categories.

- api/blogsanddrafts (GET) : Returns all current Blogs and drafts

- api/drafts (GET) : Returns all current Drafts

<strong>Secure Routes:</strong>

- api/blogs (POST) : creates new blog

- api/editblog (POST) : pushes changes to an exisiting blog

- api/blogs/:id (DELETE) : Delete blog matching :id.
