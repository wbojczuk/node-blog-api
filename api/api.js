const express = require("express");
const router = express.Router();
const data = {};
const fs = require("fs");
const path = require("path");
const fspromise = require("fs/promises")
data.blogs = require(path.join(__dirname, "blogdata.json"));

function filter_blogs(item){
    return (item.isdraft == false)
}
function filter_drafts(item){
    return (item.isdraft == true)
}
const blogs = ()=>{return (data.blogs.filter(filter_blogs)).reverse()};
const drafts = ()=>{return data.blogs.filter(filter_drafts)};

// START BLOG API
function idExists(id){
    let retval = false;
    data.blogs.forEach((blog)=>{
        if(blog.id == id){
            retval = true;
        }
    })
    return retval
}

function saveBlogs(){
    fs.writeFile(path.join(__dirname ,"blogdata.json"), JSON.stringify(data.blogs), (err)=>{if(err){console.log(err);}})
}

router.route("/blogs")
.get((req, res)=>{
    res.json(blogs());
})
.post(async (req, res)=>{
    if(req.user){
        const sentData = req.body;
        // Validate Properties Are there
        if(sentData.title && sentData.id && sentData.content && sentData.description, sentData.tags){
            if(!idExists(sentData.id)){

                // GET CURRENT BLOG ID
                await fspromise.writeFile(path.join(__dirname,`blogs/${sentData.id}.txt`), sentData.content, (err)=>{if(err){console.log(err); res.sendStatus(503)}});

                const newBlog = {id: sentData.id, isdraft: sentData.isdraft, img: sentData.img,  title: sentData.title, description: sentData.description, content: `${sentData.id}.txt`, tags: sentData.tags};
                data.blogs.push(newBlog);
                saveBlogs();
                res.status = 200;
        res.send("Completed")
            }else{
                res.status = 409;
            }
        }else{
            res.status = 406;
        }
    }else{
        res.json({"Error": "You need to be logged in to perform this action."})
        res.status = 406;
    }    
});

router.post("/editblog", async (req, res)=>{
    if(req.user){
        const sentData = req.body;
        // Validate Properties Are there
        if(sentData.title && sentData.id && sentData.content && sentData.description, sentData.tags){

                //Update Blog Content
                await fspromise.writeFile(path.join(__dirname,`blogs/${sentData.id}.txt`), sentData.content, (err)=>{if(err){console.log(err); res.sendStatus(503)}});
                const updatedBlog = {id: sentData.id, isdraft: sentData.isdraft, img: sentData.img, title: sentData.title, description: sentData.description, content: `${sentData.id}.txt`, tags: sentData.tags};

                const blogsLength = data.blogs.length;
                for(let i = 0; i < blogsLength; ++i){
                    if(data.blogs[i].id == sentData.id){
                        data.blogs[i] = updatedBlog;
                        saveBlogs();
                        res.sendStatus(200);
                        break;
                    }
                }   
        
        }else{
            res.status = 406;
        }
    }else{
        res.json({"Error": "You need to be logged in to perform this action."})
        res.status = 406;
    } 
})

// GET BLOG DATA BY ID
router.get("/blogs/id/:blogid", (req,res)=>{
    const blogsLength = data.blogs.length;
    for(let i = 0; i < blogsLength; ++i){
        if(data.blogs[i].id == req.params.blogid){
            res.json(data.blogs[i])
            break;
        }
    }
})

// GET BLOG CONTENT BY ID
router.get("/blogcontent/:blogid", (req,res)=>{
    res.sendFile(path.join(__dirname, `blogs/${req.params.blogid}.txt`))
});

// GET LATEST 4 BLOGS
router.get("/blogs/latest", (req,res)=>{
    const curBlogs = blogs();
    const blogsLength = curBlogs.length;
    if(blogsLength > 4){
        const retval = [];
        for(let i = 0; i < 4; ++i){
            retval.push(curBlogs[i]);
        }
        res.json(retval);
    }else{
        res.json(curBlogs);
    }
});

router.get("/blogs/categories", (req,res)=>{
        const categories = [];
        const curBlogs = blogs();
        curBlogs.forEach((blog)=>{
            blog.tags.forEach((tag)=>{
                if(!categories.includes(tag)){
                    categories.push(tag);
                }
            })
        });
        res.json(categories);
})

// DELETE BLOG BY ID
router.delete("/blogs/:blogid", async (req, res)=>{
    if(req.user){
        fs.rm(path.join(__dirname , `blogs/${req.params.blogid}.txt`),(err)=>{
            if(err){
                console.log(err)
                res.status = 500;
            }else{
                const blogsLength = data.blogs.length;
                for(let i = 0; i < blogsLength; ++i){
                    if(data.blogs[i].id == req.params.blogid){
                        data.blogs.splice(i, 1);
                        break;
                    }
                }
                saveBlogs();
                res.sendStatus(200)
            }
        });
    
}else{
    res.json({"Error": "You need to be logged in to perform this action."})
    res.status = 406;
}
})

// END BLOGS API

router.get("/blogsanddrafts", (req, res)=>{
    res.json(data.blogs);
})

// START DRAFTS API


router.route("/drafts")
.get(async (req, res)=>{
    res.json(drafts())
})

module.exports = router;