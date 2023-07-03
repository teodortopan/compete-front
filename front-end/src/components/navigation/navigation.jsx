import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const Navigation = ({ filterDataByCategory, setSearchText, isAuthenticated, username }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!username); // Show loading state if username is empty
  }, [username]);

  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    filterDataByCategory('', searchText);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" style={{ marginLeft: '1rem' }}>
        Compete.
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link as={Link} to="/services" className="nav-link">
              Services
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/about" className="nav-link">
              About
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/contact" className="nav-link">
              Contact
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Form inline>
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2"
            onChange={handleSearchChange}
          />
        </Form>
        <Nav style={{ marginLeft: '40rem' }}>
          {isLoading ? (
            <Nav.Item>
              <Nav.Link as={Link} to="/login" className="nav-link">
                Loading...
              </Nav.Link>
            </Nav.Item>
          ) : isAuthenticated ? (
            <Nav.Item>
              <Nav.Link as={Link} to="/login" className="nav-link">
                Currently logged in as {username}
              </Nav.Link>
            </Nav.Item>
          ) : (
            <Nav.Item>
              <Nav.Link as={Link} to="/login" className="nav-link">
                Log In
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;