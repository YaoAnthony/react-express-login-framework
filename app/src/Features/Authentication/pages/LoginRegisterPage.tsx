// state
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// component
import { Login, Register, GoogleLoginButton } from '../component';
import Navbar from '../../../Component/Navbar';



export default function LoginRegisterPage() {

    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const onSuccess = () => {
        navigate('/');
    }

    const OauthLogin = () => {
        return (
            <div className='w-64'>
                <GoogleLoginButton onSuccess={onSuccess} />
            </div>
        )
    }

    const LoginAction = () => {
        return (
            <div className='w-full flex justify-center items-center flex-col gap-12'>
                <div className='w-full flex justify-center flex-col items-center gap-12'>
                    <p className='text-3xl'>Sign to Blue Mll</p>
                    <Login onSuccess={onSuccess}/>
                </div>
                <div className='flex justify-center gap-4'>
                    <p className='select-none'>Don't have an account?</p>
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsLogin(false)}
                    >
                        Create your now.
                    </button>
                </div>

                <OauthLogin />
            </div>
        )
    }

    const RegisterAction = () => {
        return (
            <div className='w-full flex justify-center flex-col gap-12'>

                <div className='w-full flex justify-center flex-col items-center gap-12'>
                    <p className='text-3xl'>Register to Blue Mll</p>
                    <Register onSuccess={onSuccess}/>
                </div>

                <div className='flex justify-center gap-4'>
                    <p className='select-none'>Already has account?</p>
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setIsLogin(true)}
                    >
                        Login.
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />

            <main className="flex h-screen flex-col items-start py-24 gap-12 screen-max-width text-white ">

                <p className='text-4xl font-bold py-12 whitespace-nowrap'>Sign in for manage your code.</p>

                {isLogin ? <LoginAction /> : <RegisterAction />}
       
            </main>

        </div>
  );
}
