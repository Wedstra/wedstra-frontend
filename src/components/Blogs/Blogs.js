import React, { useEffect } from 'react'
import axiosInstance from '../../API/axiosInstance';
import './blogs.css';
export default function Blogs() {
    const [blogs, setBlogs] = React.useState([]);
    const [token, setToken] = React.useState(null);
    useEffect(() => {
        const fetchToken = () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
            }
        }

        fetchToken();
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
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        if (token) {
            fetchBlogs();
        }
    }, [token])
    return (
        <>
            <div className="container mt-4">
                <h1><strong>Latest Articles</strong></h1>
                {blogs.map((blog) => (
                    <div key={blog.id} className="card mb-4 shadow-sm border-0 rounded-4" style={{ background: "#f7fdfd" }}>
                        <div className="card-body">
                            {/* Author section */}
                            <div className="d-flex align-items-center mb-2">
                                <img
                                    src="..." // Replace with actual avatar if available
                                    className="rounded-circle me-3"
                                    alt="avatar"
                                    width="40"
                                    height="40"
                                    style={{  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor:"pink"  }}
                                />
                                <div>
                                    <div><h4 className="m-0 p-0" style={{ fontSize:"26px", fontWeight:'600' }}>{blog.title}</h4></div>
                                    <strong className="text-muted" style={{ fontSize:"18px" }}>Author: {blog.authorType === "vendor" ? "Vendor" : "User"} </strong>
                                </div>
                            </div>

                            {/* Blog Content */}
                            {/* <p className="text-secondary mb-0" style={{ fontSize:"18px" }}>{blog.content}</p> */}
                            <p className="text-secondary mb-0" style={{ fontSize:"18px" }}>The digital revolution has reshaped how companies interact with customers, manage operations, and innovate. Post-COVID, the urgency to adopt digital tools surged, pushing even traditional industries toward transformation. From cloud-based collaboration to AI-powered analytics, technology is now central to decision-making. Small businesses, in particular, have leveraged e-commerce and social media to reach wider audiences. However, digital growth also demands enhanced cybersecurity and employee upskilling. As we move forward, adaptability will define success in an ever-evolving digital landscape.</p>
                        </div>
                        
                    </div>
                ))}
            <hr/>
            <button className="btn btn-success">
  + New Blog
</button>
            </div>
        </>
    )
}
