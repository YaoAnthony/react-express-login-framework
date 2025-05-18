//react
import React, { useState } from 'react';

// colors
import { colors } from '../../../style';

// react router dom
import { 
    useSearchParams, 
} from 'react-router-dom';

// api
import { useLoginMutation } from '../services'
import { useLazyGetProfileQuery } from '../../../api/profileApi';

// redux
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../Redux/Features/userSlice';

//ICON
import { KeyOutlined, MailOutlined  } from '@ant-design/icons';
// types
import { 
    Credentials,
    STATES,
} from '../types';
import { AxiosErrorWithData } from '../../../types/Error';

// components
import SubmitButton from './SubmitButton';

interface LoginProps {
    onSuccess?: () => void; // 可选回调：登录成功后的自定义行为
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {

    // get the state and client_id from the URL
    const [ searchParams ] = useSearchParams();
    const dispatch = useDispatch();
    
    const [ login ] = useLoginMutation();
    const [ triggerGetProfile ] = useLazyGetProfileQuery();
    const state: string | null = searchParams.get('state');

    // login info
    const [loginInfo, setLoginInfo] = useState<Credentials>({ email: '', password: '' });
    // loading state
    const [btnState, setBtnState] = useState<keyof typeof STATES>("idle")
    // error message
    const [errorMess, setErrorMess] = useState<string>('');

    const onChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginInfo(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorMess("")
        setBtnState("processing")
    
        try {
            const { accessToken } = await login({
                email: loginInfo.email,
                password: loginInfo.password,
                state: state || undefined,
            }).unwrap()
    
            if (accessToken) {
                setLoginInfo({ email: '', password: '' })
                
                dispatch(setToken(accessToken))
    
                const user = await triggerGetProfile(accessToken).unwrap()
                dispatch(setUser(user))
    
                setBtnState("success")
    
                if (onSuccess) onSuccess()
    
                // 成功后 1.5 秒恢复 idle
                setTimeout(() => setBtnState("idle"), 1500)
            } else {
                setBtnState("error")
                setErrorMess("Server 404, please try again later.")
    
                setTimeout(() => setBtnState("idle"), 2000)
            }
        } catch (error) {
            console.error(error)
            setBtnState("error")
    
            const err = error as AxiosErrorWithData
            setErrorMess(err.error.message || "Login failed.")
    
            setTimeout(() => setBtnState("idle"), 2000)
        }
    }
    

    

    const inputStyle = `${colors.text.primary} flex-1 bg-transparent py-4 text-white placeholder-gray-400 focus:outline-none`;

    return (
        <form onSubmit={onSubmit} className={`select-none ${colors.text.primary} space-y-8`}>
            <div className="w-96 flex items-center gap-3 border-b border-gray-500 focus-within:border-blue-500 transition">
                <MailOutlined className='text-gray-400 text-lg' />
                <input
                    type="email"
                    name="email"
                    onChange={onChanges}
                    value={loginInfo.email}
                    placeholder="Email"
                    className={inputStyle}
                />
            </div>

            <div className="w-96 flex items-center gap-3 border-b border-gray-500 focus-within:border-blue-500 transition">
                <KeyOutlined className='text-gray-400 text-lg' />
                <input
                    type="password"
                    name="password"
                    onChange={onChanges}
                    value={loginInfo.password}
                    placeholder="Password"
                    className={inputStyle}
                />
            </div>

            <p className="text-red-500 min-h-[1.5rem]">{errorMess || '\u00A0'}</p> 

            <div className='w-full'>
                <SubmitButton btnState={btnState}/>
            </div>
        </form>
    );
}


export default Login;