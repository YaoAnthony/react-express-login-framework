import Modal from "../../../Component/Modal";

import { useState } from "react";

// constants
import { APPNAME } from "../../../Constant";

import Login from "./Login";
import Register from "./Register";
import GoogleLoginButton from "./GoogleLoginButton";

import { colors } from "../../../style";

//import { useTranslation } from "react-i18next";

interface ModalAuthProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ModalAuth: React.FC<ModalAuthProps> = ({ isOpen, onClose, onSuccess  }) => {
    const [isLogin, setIsLogin] = useState(true);

    const handleSuccess = () => {
        onClose();
        onSuccess?.(); // callback when login success
      }

    const GoogleLogin = () => {
        return (
            <div className='w-64'>
                <GoogleLoginButton onSuccess={handleSuccess} />
            </div>
        )
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={`hidden md:flex ${colors.text.primary} w-full justify-center items-start gap-12 md:mx-8 my-24`}>


                <div className='flex justify-center items-center flex-col gap-4'>
                    <div className='w-full flex justify-center flex-col items-center gap-7'>
                        <p className='text-3xl'>{isLogin ? `Sign to ${APPNAME}` : `Register to ${APPNAME}`}</p>
                        {isLogin ? <Login onSuccess={handleSuccess} /> : <Register onSuccess={handleSuccess} />}
                    </div>
                    <div className="w-full flex flex-col items-center gap-5">
                        <div className='flex justify-center gap-4 text-sm'>
                            <p className='select-none'>{isLogin ? "Don't have an account?" : "Already has account?"}</p>
                            <button className="text-blue-500 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                                {isLogin ? "Create your now." : "Login."}
                            </button>
                            
                        </div>
                        <GoogleLogin />
                    </div>

                </div>
            </div>
            
        </Modal>
    )
}


export default ModalAuth;