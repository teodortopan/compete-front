import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" className="mr-5">Compete.</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link as={Link} to="/services" className="nav-link">Services</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/about" className="nav-link">About</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/contact" className="nav-link">Contact</Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="ml-5">
          <Nav.Item>
            <Nav.Link as={Link} to="/signup" className="nav-link">Sign Up</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/login" className="nav-link">Log In</Nav.Link>
          </Nav.Item>
          <Form inline="true">
            <div className="d-flex">
              <FormControl type="text" placeholder="Search" className="mr-sm-2" />
              <Button variant="outline-light">Search</Button>
            </div>
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;