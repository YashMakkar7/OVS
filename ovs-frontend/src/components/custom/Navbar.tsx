import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { SignupModelStore } from "@/state_galary/SignupModel";
import { SigninModelStore } from "@/state_galary/SigninModel";
function Navbar() {
    const navigate = useNavigate();
    const {toggleModel} = SignupModelStore()
    const {toggleModelSignin} = SigninModelStore()
    return (
        <div className=" flex justify-between items-center w-full pt-3 ">
            <div onClick={() => navigate("/")} className="text-3xl font-semibold font-mono subpixel-antialiased cursor-pointer ">
                    elco
            </div>
            
            <div className="flex items-center space-x-4">
                <Button variant="default" className="rounded-md px-5 py-3 hover:bg-charcol/90" onClick={toggleModelSignin}>
                    Sign in
                </Button>
                <Button variant="default" className="rounded-md px-5 py-3 bg-primaryblue/90 text-white hover:bg-secondaryblue/70" onClick={toggleModel}>
                    Sign up
                </Button>
            </div>
        </div>
    );
}

export default Navbar;