import React from 'react'
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import logo from '../assets/logo.png'
// Use to wrap bootstrap element in link(react-router)
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import SearchBox from './SearchBox'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Name the variable whatever we want   
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
        await logoutApiCall().unwrap();
        dispatch(logout());
        navigate('/login')
    } catch (error) {
        console.log(error)
    }
  }
    
  return (
    <header>
        {/* Expand set to lg for hamburger menu to show up */}
        <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
            {/* Put in a container so the inner element dont go to the edge of browser */}
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand>
                        <img src={logo} alt='Proshop' />
                        Proshop
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ms-auto'>
                        <SearchBox />
                        <LinkContainer to='/cart'>
                        <Nav.Link>
                            <FaShoppingCart style={{ margin: '0 0.5rem'}}/>Cart
                            {
                                cartItems.length > 0 && (
                                    <Badge pill bg='success' style={{
                                        marginLeft: '5px'
                                    }}>
                                        {cartItems.reduce((acc, currentItem) => acc + currentItem.qty, 0)}
                                    </Badge>
                                )
                            }
                        </Nav.Link>
                        </LinkContainer>

                        { userInfo ? (
                            < NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>
                                        Profile
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (<LinkContainer to='/login'>
                        <Nav.Link>
                            <FaUser style={{ margin: '0 0.5rem'}}/>Sign In
                        </Nav.Link>
                        </LinkContainer>) 
                        }
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>
                                        Products
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>
                                        Users
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>
                                        Orders
                                    </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    </header>
  )
}

export default Header
