import Navbar from "@/components/custom/Navbar";
import Hero from "@/components/custom/Hero";
import FeaturesSection from "@/components/custom/FeaturesSection";
import SignupModel from "@/components/custom/SignupModel";
import SigninModel from "@/components/custom/SigninModel";
import { SignupModelStore } from "@/state_galary/SignupModel";
import { SigninModelStore } from "@/state_galary/SigninModel";
function Home() {
    const {isOpen,toggleModel} = SignupModelStore() //signup
    const {isOpenSignin,toggleModelSignin} = SigninModelStore() //signup
    return (
        <div className="cuvybg min-h-screen">
            <SignupModel open={isOpen} onClose={toggleModel}/>
            <SigninModel open={isOpenSignin} onClose={toggleModelSignin}/>
            <div className="w-[85%] max-w-7xl mx-auto pt-6">
                <Navbar />
                <Hero />
            </div>
            <div className="bg-white mt-5">
                <FeaturesSection />
            </div>
            
        </div>
    );
}

export default Home;
