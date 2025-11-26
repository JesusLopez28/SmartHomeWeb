import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Tab, Tabs } from 'react-bootstrap';
import { FaHome, FaCamera, FaChartLine } from 'react-icons/fa';
import Dashboard from './components/Dashboard';
import PhotoGallery from './components/PhotoGallery';
import SensorEvents from './components/SensorEvents';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>
            <FaHome className="me-2" />
            Smart Home Security System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#" active={activeTab === 'dashboard'}>
                Panel Principal
              </Nav.Link>
              <Nav.Link href="#" active={activeTab === 'photos'}>
                Galería de Fotos
              </Nav.Link>
              <Nav.Link href="#" active={activeTab === 'sensors'}>
                Eventos de Sensores
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="dashboard" title={<><FaHome className="me-2" />Dashboard</>}>
            <Dashboard />
          </Tab>
          <Tab eventKey="photos" title={<><FaCamera className="me-2" />Fotos</>}>
            <PhotoGallery />
          </Tab>
          <Tab eventKey="sensors" title={<><FaChartLine className="me-2" />Sensores</>}>
            <SensorEvents />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
}

export default App;
