import React from "react";
import { motion } from "framer-motion";
import successIllustration from "../../images/success.png";
import "./service_success.css";
import { useNavigate } from "react-router-dom";

export default function ServiceSuccess() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/vendor-dashboard");
    };

    return (
        <div className="success-container">
            <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img src={successIllustration} alt="Service Created Successfully" className="illustration" />
                <h1 id="success-title">Service Created Successfully!</h1>
                <p id="subTitle">
                    Your service has been added successfully. You can now manage your service details and attract customers.
                </p>
                <button className="proceed-button" onClick={handleClick}>
                    View Your Services
                </button>
            </motion.div>
        </div>
    );
}
