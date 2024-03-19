import { useGlobalContext } from 'providers/GlobalProvider';
import { logout } from 'providers/actionCreators';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function NewHeader() {
  const navigate = useNavigate()
  const { loggedIn, dispatch, user } = useGlobalContext();

  const handleLinkClick = (path: string) => {
    navigate(path)
    const close = document.getElementById('closeButton');
    close.click();
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <div style={{ color: 'white', padding: '10px', textAlign: 'center' }}><b>BookBazar</b>
              <img src="logo.png" alt="" style={{ width: '50px', height: 'auto', borderRadius: '50%' }} />
            </div>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end text-bg-dark" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
            <div className="offcanvas-header">
            {loggedIn && <><h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Welcome {user.NAME}</h5></>}
              
              <button type="button" id='closeButton' className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              {loggedIn && <>
                <div className="d-flex flex-column">
                  <a className="text-white text-decoration-none mb-2 sidemenulink" onClick={() => handleLinkClick("/profile")}>Profile</a>
                  <a className="text-white text-decoration-none mb-2 sidemenulink" onClick={() => handleLinkClick("/products")}>Books</a>
                  <a className="text-white text-decoration-none mb-2 sidemenulink" onClick={() => handleLinkClick("/addproduct")}>Add Book</a>
                  <div className="text-white cursor-pointer mb-2 sidemenulink" onClick={() => dispatch(logout())}>Logout</div>
                </div>
              </>}
              {!loggedIn && (
                <div className="d-flex flex-column">
                  <a className="text-white text-decoration-none mb-2 sidemenulink" onClick={() => handleLinkClick("/login")}>Login</a>
                  <a className="text-white text-decoration-none sidemenulink" onClick={() => handleLinkClick("/signup")}>Signup</a>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </div>
  )
}
