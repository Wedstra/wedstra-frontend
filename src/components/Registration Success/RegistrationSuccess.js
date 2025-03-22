import React from "react";
import { motion } from "framer-motion";
import successIllustration from "../../images/success.png";
import "./register_success.css";
import { useNavigate } from "react-router-dom";

export default function RegistrationSuccess() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/vendor-login")
    }

    return (
        <div className="success-container">
            <motion.div
                className="success-message"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img src={successIllustration} alt="Vendor Registration Success" className="illustration" />
                <h1 id="success-title">Vendor Registration Successful!</h1>
                <p id="subTitle">Congratulations! Your vendor account has been successfully created. You can now start managing your business with us.</p>
                <button className="proceed-button" onClick={handleClick}>
                    Continue to Login
                </button>
            </motion.div>
        </div>
    );
}
