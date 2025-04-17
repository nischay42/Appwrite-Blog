import React, { useState } from "react";
import { Container, Logo} from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const dispatch = useDispatch()

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My posts",
      slug: "/my-posts",
      active: authStatus,
    },
    {
      name: "Inactive Posts",
      slug: "/inactive-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  // logout handle

  
  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout())
      
      localStorage.clear()
      sessionStorage.clear()
      // to reset scroll position
      window.scrollTo({ top: 0, behavior: 'auto' });
      sessionStorage.setItem('manualScrollReset', 'true')
      navigate('/')
    })
}



  return (
    <header className="py-3 shadow sticky top-0 z-30 bg-gray-500">
      {/* Logout confirm popup */}
     {logoutConfirm && ( <div className="h-screen w-full absolute flex items-center justify-center">
          <div className=" bg-white p-8 rounded-lg">

            <h2 className="text-xl font-semibold text-[#6A87CD]">Confirm logout</h2>
            <hr className="w-[16rem] outline-1 my-3 text-[#E8EDF8]" />
            <h3 className="font-semibold text-[#6A87CD]">Are you sure you want to log out?</h3>

            <div className="flex justify-around mt-10 mb-1">
              <button 
              className="border-2 px-4 py-1 font-bold border-[#E8EDF8] text-[#6A87CD] rounded-3xl cursor-pointer"
              onClick={() => setLogoutConfirm(false)}
              >Cancel</button>

              <button 
              className="border px-7 py-1 rounded-3xl bg-[#6A87CD] text-white font-semibold cursor-pointer"
              onClick={() => {
                logoutHandler()
                setLogoutConfirm(false);
                }}
              >OK</button>
            </div>
          </div>
        </div>)}

      <Container>
        <nav className="flex w-full">
          {/* Logo */}
          <div className="mr-2 md:mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>
          {/* Mobile Menu Icon */}
          <div className="sm:hidden flex ml-auto">
            <button
              onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsMobileMenuOpen(true)}
              className={`text-white text-2xl transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : '-rotate-0'}`}
            >
              {isMobileMenuOpen ? (
                <FaTimes  />
                ) : (
                <FaBars />) }
            </button>
          </div>
          {/* Desktop Menu */}
          <ul className="hidden sm:flex ml-auto">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      // Reset scroll manually for only Home and All Posts
                      if (item.slug === "/" || item.slug === "/my-posts") {
                        sessionStorage.setItem("manualScrollReset", "true");
                      }
                      navigate(item.slug);
                    }}
                    className="inline-block px-[1.9vw] py-2 md:px-6 duration-200 hover:bg-blue-100 rounded-full"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <button
                 onClick={() => setLogoutConfirm(true)}
                 className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

            {/* Mobile Menu */}
              <ul
              className={`absolute top-16 left-0  w-2/4 h-screen flex flex-col items-center space-y-4 py-4 pt-8 text-white bg-gray-700 sm:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
              >
                {navItems.map((item) =>
                  item.active && (
                    <li key={item.name}>
                      <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        if(item.slug === "/" || item.slug === "/my-posts"){
                          sessionStorage.setItem('manualScrollReset', 'true')
                        }
                        navigate(item.slug)
                      }}
                      className="block text-xl px-4 py-2 duration-200  rounded-full"
                      >
                        {item.name}
                      </button>
                    </li>
                  )
                )}
                {authStatus && (
                  <li className="text-xl">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setLogoutConfirm(true)
                      }}
                      className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                      >
                        Logout
                    </button>
                  </li>
                 )}
              </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
