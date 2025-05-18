//react
import { useLayoutEffect, useEffect } from 'react'

//react route dom
import { Routes, Route, useLocation } from 'react-router-dom'

//motion
import { AnimatePresence } from 'motion/react';

//pages
import {
    MainPage,
} from './Pages'


//feature page
import { LoginRegisterPage, GithubCallback } from './Features';

//RTK Query
import { useLazyGetProfileQuery } from './api/profileApi'
import { AppDispatch } from './Redux/store';

//redux
import { useDispatch } from 'react-redux';
import { setToken, setUser } from './Redux/Features/userSlice';



// Scroll to the top of the page when the location changes
function ScrollToTop() {
    const location = useLocation();

    useLayoutEffect(() => {
        // Scroll to the top of the page when the location changes
        window.scrollTo(0, 0);
    }, [location]);

  // Return null as this component doesn't render anything
  return null;
}

const App = () => {

    //Access token from local storage
    const dispatch = useDispatch<AppDispatch>();
    const [triggerGetProfile] = useLazyGetProfileQuery()

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        dispatch(setToken(accessToken || '')) // Set the token in Redux store
        
        if (accessToken) {
            triggerGetProfile(accessToken)
                .unwrap()
                .then(user => {
                  dispatch(setUser(user))
                })
                .catch(err => {
                    console.error('Failed to load profile:', err)
                    localStorage.removeItem('accessToken') // 如果 token 失效可以选择清除
                })
        }
    }, [dispatch, triggerGetProfile])


    return (
        <div className="relative">
            <ScrollToTop />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<LoginRegisterPage />} />
                    <Route path="/github-callback" element={<GithubCallback />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}


export default App;