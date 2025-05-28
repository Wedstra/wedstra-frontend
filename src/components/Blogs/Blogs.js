import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance';
import './blogs.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


export default function Blogs({ homepage }) {
    const [blogs, setBlogs] = useState([]);
    const [token, setToken] = useState(null);
    const [blog, setBlog] = useState({
        "title": "",
        "content": "",
        "authorType": "",
        "authorId": ""
    });

    const notify = (status) => {
        (status == "success") ? (toast.success('Blog posted successfully', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        })) : ((toast.error('Blog posting failed', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        })))
    };

    useEffect(() => {
        const fetchToken = () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        }

        const fetchAutherAndAutherType = () => {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setBlog((prevBlog) => ({
                    ...prevBlog,
                    authorId: user.id,
                    authorType: user.role
                }));
            }
        }
        fetchToken();
        fetchAutherAndAutherType();
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosInstance.get("/blogs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status !== 200) {
                    throw new Error("Network response was not ok");
                }
                (homepage == true) ? setBlogs((response.data).slice(0,3)) : setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        if (token) {
            fetchBlogs();
        }
    }, [token]);

    const postBlog = async () => {
        console.log(blog);
        const response = await axiosInstance.post("/blogs", blog, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.status === 200) {
            setBlogs([...blogs, response.data]);
            setBlog({
                "title": "",
                "content": "",
                "authorType": "",
                "authorId": ""
            });

            notify("success");
        }
        else {
            notify("failed");
        }
    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="container mt-4">
                { !homepage && <h1><strong>Latest Articles</strong></h1>}
                {blogs.map((blog) => (
                    <>
                        <div key={blog.id} className="card mb-4 shadow-sm border-0 rounded-4" style={{ background: "#f7fdfd" }}>
                            <div className="card-body">
                                {/* Author section */}
                                <div className="d-flex align-items-center mb-2">
                                    <img
                                        src="..."
                                        className="rounded-circle me-3"
                                        alt="avatar"
                                        width="40"
                                        height="40"
                                        style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor: "pink" }}
                                    />
                                    <div id='blog-author-section'>
                                        <section>
                                            <div><h4 className="m-0 p-0" style={{ fontSize: "26px", fontWeight: '600' }}>{blog.title}</h4></div>
                                            <strong className="text-muted" style={{ fontSize: "18px", textTransform: "capitalize" }}>
                                                Author: {blog.authorType.charAt(0).toUpperCase() + blog.authorType.slice(1).toLowerCase()}
                                            </strong>
                                        </section>
                                        <section>
                                            <strong className="text-muted" style={{ fontSize: "15px", textTransform: "capitalize" }}>
                                                Posted on: {blog.createdAt.slice(0, 10)}
                                            </strong>
                                        </section>
                                    </div>
                                </div>

                                {/* Blog Content */}
                                <p className="text-secondary mb-0" style={{ fontSize: "18px" }}>{blog.content}</p>
                            </div>
                        </div>
                        <hr />
                    </>
                ))}



                {/* Blog Creation Modal */}
                <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog custom-modal-width">
                        <div class="modal-content">

                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Create New Blog</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div class="modal-body">
                                <form id="blogForm">
                                    <div class="mb-3">
                                        <label for="blogTitle" class="form-label">Title</label>
                                        <input type="text" class="form-control" id="blogTitle" name="title" placeholder="Enter blog title" value={blog.title}
                                            onChange={(e) => setBlog({ ...blog, title: e.target.value })} required />
                                    </div>

                                    <div class="mb-3">
                                        <label for="blogContent" class="form-label">Content</label>
                                        <textarea class="form-control" id="blogContent" name="content" rows="10" placeholder="Write your blog content here..." value={blog.content}
                                            onChange={(e) => setBlog({ ...blog, content: e.target.value })} required></textarea>
                                    </div>
                                </form>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={postBlog}>Post Blog</button>
                            </div>

                        </div>
                    </div>
                </div>

                { !homepage && <button className="btn btn-success" id='add-blog-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    + New Blog
                </button>}
            </div>
        </>
    )
}
