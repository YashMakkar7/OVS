import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { useRef, useEffect, useState } from "react";
import { BACKEND_URL } from "@/config";
import { SigninModelStore } from "@/state_galary/SigninModel";


export default function SignupModel({ open, onClose }: { open: boolean, onClose: () => void }) {
    const usernameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const adharRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Signup Failed");
    const {toggleModelSignin} = SigninModelStore()

    useEffect(() => {
        if (open && usernameRef.current) {
            usernameRef.current.focus();
        }
    }, [open]);
    
    async function addContent() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const adharId = adharRef.current?.value;
        const email = emailRef.current?.value;
        try{
            await axios.post(`${BACKEND_URL}/auth/signup`,{
                username,email,password,adharId
            })
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
                setShowSuccess(false);
                toggleModelSignin();
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
                                Sign Up
                            </motion.h2>
                            <motion.p 
                                className="text-gray-700 mb-6"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            >
                                Create your account to get started <br></br>
                                <span className="text-primaryblue">* </span>Password must contains one uppercase, one lowercase and a digit
                            </motion.p>

                            {/* Form placeholder */}
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.2 }}
                                >
                                    <input
                                        ref ={usernameRef} 
                                        type="text"
                                        placeholder="Username"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.2 }}
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
                                    transition={{ delay: 0.25, duration: 0.2 }}
                                >
                                    <input
                                        ref={adharRef}
                                        type="text"
                                        placeholder="Aadhar ID"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.2 }}
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
                                    transition={{ delay: 0.1, duration: 0.2 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick = {()=>{
                                        addContent()
                                    }}
                                >
                                    Create Account
                                </motion.button>
                            </div>

                            <motion.div 
                                className="mt-4 text-center text-sm text-gray-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.2 }}
                            >
                                Already have an account? <motion.span 
                                    className="text-indigo-600 hover:text-secondaryblue cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={()=>{
                                        onClose();
                                        toggleModelSignin();
                                    }}
                                >
                                    Sign in
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
                        <span className="font-medium">Signup Successful!</span>
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