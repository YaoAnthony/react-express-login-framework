//react
import React from 'react';

//redux
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Features/userSlice';

//router
import { useNavigate,useLocation,NavLink } from 'react-router-dom';

//antd
import { message } from 'antd';

//motion
import { motion } from 'framer-motion';
import { dropDown } from '../../Motion';

//icons
import { 
    HeartOutlined,
    UserOutlined,
    ShopOutlined 
} from '@ant-design/icons';
import { IoIosLogOut } from "react-icons/io";

//types
import { User } from '../../types/User';

//redux
import { useSelector } from 'react-redux';

// interface DropDownBarProps {
//     isOpen: boolean;
// }


//const DropDownBar : React.FC<DropDownBarProps> = ({isOpen}) => {
const DropDownBar = () => {
    //hook
    const user = useSelector((state: { user: { user: User; }; }) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate(); //navigate to other page
    const location = useLocation(); //get the path


    //Sign out action
    const handleSignOut = () => {
        
        //if(!isOpen){ return; }
        
        console.log('sign out')

        dispatch(logout());
        
        // cehck the path
        if (location.pathname.startsWith('/profile/')) {
            
            navigate('/');
        }

        message.success("You have successfully logged out")
    }


    //style
    const itemStyle = "w-full flex gap-2 items-center text-left text-[1rem] px-5 py-2 text-[#1B325F] hover:bg-gray-200 rounded-md whitespace-nowrap"


    const ListButton = ({to,title,icon}: {to: string, title: string, icon: React.ReactNode}) => {

        return(
            <NavLink to={to}>
                <motion.button
                    className={itemStyle}
                    whileTap={{ scale: 0.95 }}
                    variants={dropDown.itemVariants}
                >
                    {icon}
                    {title}
                </motion.button>
            </NavLink>
        )
    }

    return(
        <motion.div
            className="h-auto  px-5 py-2 rounded-[10px]  text-[#1B325F] select-none shadow-product"
            variants={dropDown.containerVariants}
            initial="closed"
            animate={"open"}
        >
            <h1 className='text-center w-full text-xl my-5'>Hi, {user.username}</h1>
            <ListButton to="/dashboard/profile" title={'Profile'} icon={<UserOutlined />}/>
            <ListButton to="/project" title={'Projects'} icon={<ShopOutlined />}/>
            <ListButton to="/dashboard/mySubscription" title={'Subscription'} icon={<HeartOutlined />}/>
            <div className="text-gray-200"><hr/></div>
            <motion.button
                className={itemStyle}
                whileTap={{ scale: 0.95 }}
                variants={dropDown.itemVariants}
                onClick={handleSignOut}
            >
                <IoIosLogOut />
                Logout
            </motion.button>

        </motion.div>
    )
}


export default DropDownBar;