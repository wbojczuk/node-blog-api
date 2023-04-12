# node-blog-backend Filesystem
Saves blogs on project filesystem in a .JSON system
<h2>Setup</h2>
- Run "npm i" to install dependencies. <br>
- Hash new username and passwords for the dashboard in auth/login.js <br>
- Set up IMGUR API and put Client ID in secure/dashboard/blogbuilder.html and secure/dashboard/blogeditor.html <br>
- Add dev server to CORS in "app.js" <br><br>

- Add to the frontend's style.css to get custom fonts in TinyMCE - @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Inspiration&family=Lobster&display=swap');

- Can Use NCC to compile. <br>
- Compiled/Bundled with NCC "ncc build app.js -o dist" <br>
- NOTE: Since NCC bundles into a single STATIC file, you need to manually update the require to the "blogdata.json" file after complilation/bundling.<br>
- TinyMCE is served in the "public" folder to the dashboard. You'll need to take it out while compiling then add it back.<br><br>


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
