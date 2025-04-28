import IllusGif from "../icons/illusgif";
import { Button } from "../ui/button";
import ShieldIcon from "../icons/ShieldIcon"
import CheckIcon from "../icons/CheckIcon"
import ClockIcon from "../icons/ClockIcon"
import LockIcon from "../icons/LockIcon"
import { SigninModelStore } from "@/state_galary/SigninModel";

function Hero() {
    const {toggleModelSignin} = SigninModelStore()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 relative">

            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            
            {/* Left side content */}
            <div className="flex flex-col space-y-6 z-10 pr-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-2">
                    <LockIcon className="w-4 h-4 mr-1" /> Built with advanced security
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Secure, Transparent <span className="text-indigo-600">Online Voting</span> Solution
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                    Make your vote count with our advanced, tamper-proof platform. 
                    Perfect for elections, corporate decisions, and community polls.
                </p>
                
                <div className="flex flex-wrap items-center pt-4">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-md" onClick={()=>{
                        toggleModelSignin();
                    }}>
                        Vote Now
                    </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 pt-6">
                    <div className="flex items-center">
                        <div className="text-indigo-600">
                            <ShieldIcon />
                        </div>
                        <p className="ml-2 text-sm font-medium">End-to-End Encryption</p>
                    </div>
                    <div className="flex items-center">
                        <div className="text-indigo-600">
                            <CheckIcon />
                        </div>
                        <p className="ml-2 text-sm font-medium">Tamper-Proof Results</p>
                    </div>
                    <div className="flex items-center">
                        <div className="text-indigo-600">
                            <ClockIcon />
                        </div>
                        <p className="ml-2 text-sm font-medium">Real-Time Results</p>
                    </div>
                </div>
            </div>
            
            {/* Right side illustration - adjusted spacing for larger size */}
            <div className="flex justify-end items-center">
                <IllusGif />
            </div>
        </div>
    );
}

export default Hero;