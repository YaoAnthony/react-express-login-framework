import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//motion
import { motion } from "motion/react";

//constants
import { APPNAME,navLists } from "../Constant";

//redux
import { useSelector } from "react-redux";

//logo
import { GitlabFilled } from "@ant-design/icons";
import { MenuOutlined } from "@ant-design/icons";

//types
import { RootState } from "../Redux/store";

//style
import { colors } from "../style";

import { useAuthModal } from "../Features/Authentication/component/ModalAuthContext";

//antd
import { Tooltip } from "antd";
import { Avatar } from "antd";

//components
import DarkLightSwitch from "./DarkLightSwitch";
import DropDownBar from "./DropDownBar";


const DesktopHeader = () => {
  const [isOpen, setIsOpen] = useState(false); // 控制下拉菜单状态
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state:RootState) => state.user.isLoggedIn);
  const { user } = useSelector((state:RootState) => state.user);

  const { showAuthModal } = useAuthModal();
  

  const handleScrollToSection = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };


  return (
    <nav className="hidden md:flex w-full screen-max-width items-center">
        <NavLink to="/" className={`flex items-center gap-2 ${colors.text.primary} `}>
          <GitlabFilled className=" text-2xl" />
          <span className="text-2xl font-bold ">{APPNAME}</span>
        </NavLink>

        <div className="flex-1 flex justify-center">
          <div
            onClick={() => handleScrollToSection("pricing")}
            className={`px-5 ${colors.text.secondary} ${colors.text.hoverSecondary} cursor-pointer transition-all`}
          >
            Pricing
          </div>
          {navLists.map((link, index) => (
            <NavLink
              key={index}
              to={`/${link.toLowerCase()}`}
              className={`px-5 ${colors.text.secondary} ${colors.text.hoverSecondary} cursor-pointer transition-all`}
            >
              {link}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-7 justify-end">
          <DarkLightSwitch />
          {
            isAuthenticated ? (
              <>
                    
                    < Tooltip 
                        color='white'
                        //当离开tooltip，设置isOpen为false
                        onOpenChange={() => setIsOpen(false)}
                        fresh={true}
                        title={< DropDownBar />}
                        styles={{
                          root: {
                            whiteSpace: 'normal',
                            maxWidth: 'none',
                            padding: 0,
                          },
                        }}>
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className="h-12 flex gap-2 items-center text-lg tracking-wide font-sans cursor-pointer ">
                        <div onMouseEnter={() => setIsOpen(true)} className='flex items-center gap-2 select-none ' >
                            <Avatar src={user?.image_url} alt='avatar' className='w-10 h-10 rounded-full'/>
                        </div>
                    </div>
                    </Tooltip>
                </>
            ) : (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <div 
                  onClick={() => showAuthModal()}
                  className={`max-sm:hidden text-lg cursor-pointer select-none ${colors.text.primary}`}>
                  Login
                </div>
              </motion.div>
            )
          }

          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`max-sm:hidden ${colors.button.primary} ${colors.button.primaryHover} border-2 px-5 py-2 rounded-full transition-all cursor-pointer select-none`}
          >
            Download
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="text-white text-lg cursor-pointer select-none max-sm:block hidden"
          >
            <MenuOutlined />
          </motion.div>
        </div>
      </nav>
  )

}

const MobileHeader = () => {


  return (
    <nav className="flex md:hidden items-center justify-between w-full px-5 ">
      <div className="flex items-center gap-2 text-white-text dark:text-dark-text-primary">
        <GitlabFilled className=" text-2xl" />
        <span className=" text-xl font-bold ">{APPNAME}</span>
      </div>
      <div className="flex items-center gap-5">
        <MenuOutlined className="text-2xl" />
      </div>
    </nav>
  )
}


const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false); // 控制滚动状态

  // Scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full py-5 sm:px-10 px-5 z-50 transition-all duration-500 ${
        isScrolled ? "backdrop-blur-md bg-white/50 dark:bg-black/50 shadow-lg" : "bg-transparent"
      }`}
    >
      <DesktopHeader />
      <MobileHeader />
    </header>
  );
};

export default Navbar;
