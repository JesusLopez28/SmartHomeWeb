import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from '../firebase';
import { 
  FaCamera, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaWalking,
  FaClock,
  FaChartLine
} from 'react-icons/fa';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalSensorEvents: 0,
    recentPhotos: [],
    recentEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Referencia a fotos
    const photosRef = ref(database, 'eventos/fotos');
    const photosQuery = query(photosRef, limitToLast(5));

    // Referencia a eventos de sensores
    const sensorsRef = ref(database, 'eventos/sensores');
    const sensorsQuery = query(sensorsRef, limitToLast(10));

    const unsubscribePhotos = onValue(photosQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photosArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setStats(prev => ({
          ...prev,
          totalPhotos: photosArray.length,
          recentPhotos: photosArray.reverse()
        }));
      }
      setLoading(false);
    });

    const unsubscribeSensors = onValue(sensorsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setStats(prev => ({
          ...prev,
          totalSensorEvents: eventsArray.length,
          recentEvents: eventsArray.reverse()
        }));
      }
      setLoading(false);
    });

    return () => {
      unsubscribePhotos();
      unsubscribeSensors();
    };
  }, []);

  const getSensorIcon = (sensor) => {
    switch (sensor) {
      case 'PIR': return <FaWalking />;
      case 'Ultrasonico': return <FaExclamationTriangle />;
      case 'LDR': return <FaLightbulb />;
      case 'Camara': return <FaCamera />;
      default: return <FaClock />;
    }
  };

  const getSensorBadgeClass = (sensor) => {
    switch (sensor) {
      case 'PIR': return 'bg-danger';
      case 'Ultrasonico': return 'bg-warning';
      case 'LDR': return 'bg-info';
      case 'Camara': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Panel de Control</h2>
      
      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="stat-card primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats.totalPhotos}</h3>
                  <p className="text-muted mb-0">Fotos Capturadas</p>
                </div>
                <FaCamera size={40} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="stat-card success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-0">{stats.totalSensorEvents}</h3>
                  <p className="text-muted mb-0">Eventos de Sensores</p>
                </div>
                <FaExclamationTriangle size={40} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Fotos Recientes */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <FaCamera className="me-2" />
              Fotos Recientes
            </Card.Header>
            <Card.Body>
              {stats.recentPhotos.length === 0 ? (
                <Alert variant="info">No hay fotos disponibles</Alert>
              ) : (
                <Row>
                  {stats.recentPhotos.slice(0, 3).map((photo) => (
                    <Col md={4} key={photo.id} className="mb-3">
                      <Card>
                        <Card.Img 
                          variant="top" 
                          src={`data:image/jpeg;base64,${photo.image}`}
                          alt="Captura de cámara"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                          <small className="text-muted">
                            <FaClock className="me-1" />
                            {photo.timestamp}
                          </small>
                          <p className="mb-0 mt-2">
                            <small>
                              {photo.width} x {photo.height} | {(photo.size / 1024).toFixed(2)} KB
                            </small>
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Eventos Recientes */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <FaChartLine className="me-2" />
              Eventos Recientes de Sensores
            </Card.Header>
            <Card.Body>
              {stats.recentEvents.length === 0 ? (
                <Alert variant="info">No hay eventos disponibles</Alert>
              ) : (
                <div className="timeline">
                  {stats.recentEvents.map((event) => (
                    <div key={event.id} className="timeline-item">
                      <Card className="mb-2">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-2">
                                {getSensorIcon(event.sensor)}
                                <span className="ms-2">{event.event.replace(/_/g, ' ')}</span>
                                <span className={`badge ${getSensorBadgeClass(event.sensor)} ms-2`}>
                                  {event.sensor}
                                </span>
                              </h6>
                              <small className="text-muted">
                                <FaClock className="me-1" />
                                {event.timestamp}
                              </small>
                              {event.value && (
                                <p className="mb-0 mt-2">
                                  <strong>Valor:</strong> {event.value} cm
                                </p>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
