//react
import { useState } from 'react';

//dispatch
import { useDispatch } from 'react-redux';
import { setToken,setUser } from '../../../Redux/Features/userSlice';

// react router dom
import { useSearchParams } from 'react-router-dom';

//type
import { 
    Credentials,
    STATES,
} from '../types';
import { AxiosErrorWithData } from '../../../types/Error';

//api
import { useRegisterMutation } from '../services';
import { useLazyGetProfileQuery } from '../../../api/profileApi';

// style
import { colors } from '../../../style';

// components
import SubmitButton from './SubmitButton';

//ICON
import { KeyOutlined, MailOutlined  } from '@ant-design/icons';

interface RegisterProps {
    onSuccess?: () => void; // 可选回调：登录成功后的自定义行为
}

const Register: React.FC<RegisterProps> = ({ onSuccess }) => {

    
    // get the state and client_id from the URL
    const [ searchParams ] = useSearchParams();

    // dispatch
    const dispatch = useDispatch();

    const state: string | null = searchParams.get('state');

    // login info
    const [ registerInfo, setRegisterInfo ] = useState<Credentials>({ email: '', password: '' });
    // error message
    const [ errorMess, setErrorMess ] = useState<string>("");
// loading state
    const [btnState, setBtnState] = useState<keyof typeof STATES>("idle")
    // register mutation
    const [ register ] = useRegisterMutation();

    const [ triggerGetProfile ] = useLazyGetProfileQuery();
    

    const onChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterInfo({
            ...registerInfo,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMess("")
        setBtnState("processing")

        try {
            const { accessToken } = await register({
                email: registerInfo.email,
                password: registerInfo.password,
                state: state || undefined, 
            }).unwrap();
    
            if (accessToken) {
                // clear the form
                setRegisterInfo({ email: '', password: '' });
    
                dispatch(setToken(accessToken));
    
                // RTK get profile
                const user = await triggerGetProfile(accessToken).unwrap();
                dispatch(setUser(user));
                
                setBtnState("success")
    
                if (onSuccess) {
                    onSuccess(); 
                } 
            } else {
                setBtnState("error")
                setErrorMess("Server 404, please try again later.")
    
                setTimeout(() => setBtnState("idle"), 2000)
            }
        }catch (error) {
            setBtnState("error")
    
            const err = error as AxiosErrorWithData;
            setErrorMess(err.response.data.message);
        }
    }

    const inputStyle = `${colors.text.primary} flex-1 bg-transparent py-4 text-white placeholder-gray-400 focus:outline-none`;
    

    return (
        <form onSubmit={onSubmit} className="space-y-7">
            <div className="w-96 flex items-center gap-3 border-b border-gray-500 focus-within:border-blue-500 transition">
                <MailOutlined className='text-gray-400 text-lg' />
                <input
                    type="email"
                    name="email"
                    onChange={onChanges}
                    value={registerInfo.email}
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
                    value={registerInfo.password}
                    placeholder="Password"
                    className={inputStyle}
                />
            </div>
            <p className="text-red-500 min-h-[1.5rem]">{errorMess || '\u00A0'}</p> 

            <SubmitButton btnState={btnState}/>
        </form>
    );
}


export default Register;