import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/config";
import { SignupModelStore } from "@/state_galary/SignupModel";

export default function SigninModel({ open, onClose }: { open: boolean, onClose: () => void }) {

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Signin Failed");
    const {toggleModel} = SignupModelStore();

    useEffect(() => {
        if (open && emailRef.current) {
            emailRef.current.focus();
        }
    }, [open]);
    
    async function addContent() {

        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;
        try{
            const response = await axios.post(`${BACKEND_URL}/auth/signin`,{
                email,password
            })
            const jwt = response.data.token
            localStorage.setItem("token",jwt)
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
                setShowSuccess(false);
                navigate("/dashboard");
            }, 1000);
        }catch(e: any){
            console.log(e);
            // Set error message based on the response if available
            const message = e.response?.data?.msg || "Signup Failed";
            setErrorMessage(message);
            setShowError(true);
            // Auto-hide error after 3 seconds
            setTimeout(() => {
                setShowError(false);
            }, 1500);
        }
    }
    return (
        <>
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop overlay */}
                        <motion.div 
                            className="absolute inset-0 bg-black/30 backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        />

                        {/* Modal content */}
                        <motion.div 
                            className="relative z-10 w-[90%] max-w-md bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ 
                                duration: 0.2,
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                            }}
                        >
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <motion.svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    whileHover={{ rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </motion.svg>
                            </button>

                            <motion.h2 
                                className="text-2xl font-bold mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05, duration: 0.2 }}
                            >
                                Sign in
                            </motion.h2>
                            <motion.p 
                                className="text-gray-700 mb-6"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            >
                                Sign in to cast your vote
                            </motion.p>

                            {/* Form placeholder */}
                            <div className="space-y-4">
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.2 }}
                                >
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </motion.div>
                            
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.2 }}
                                >
                                    <input
                                        ref = {passwordRef}
                                        type="password"
                                        placeholder="Password"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </motion.div>
                                <motion.button 
                                    className="w-full p-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-secondaryblue cursor-pointer"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.2 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick = {()=>{
                                        addContent()
                                    }}
                                >
                                    Signin
                                </motion.button>
                            </div>

                            <motion.div 
                                className="mt-4 text-center text-sm text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.2 }}
                            >
                                Create an Account? <motion.span 
                                    className="text-indigo-600 hover:text-secondaryblue cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={()=>{
                                        onClose(),
                                        toggleModel()
                                    }}
                                >
                                    Sign up
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Toast Notification */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-md shadow-md flex items-center space-x-2 z-50"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="font-medium">Signin Successful!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Toast Notification */}
            <AnimatePresence>
                {showError && (
                    <motion.div 
                        className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md shadow-md flex items-center space-x-2 z-50"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="font-medium">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}