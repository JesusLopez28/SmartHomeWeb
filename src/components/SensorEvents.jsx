import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { database } from '../firebase';
import { 
  FaWalking, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaCamera,
  FaClock,
  FaFilter
} from 'react-icons/fa';

function SensorEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState('all');

  useEffect(() => {
    const sensorsRef = ref(database, 'eventos/sensores');
    const sensorsQuery = query(sensorsRef, orderByChild('timestamp'));

    const unsubscribe = onValue(sensorsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setEvents(eventsArray.reverse());
        setFilteredEvents(eventsArray.reverse());
      } else {
        setEvents([]);
        setFilteredEvents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedSensor === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.sensor === selectedSensor));
    }
  }, [selectedSensor, events]);

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
      case 'Ultrasonico': return 'bg-warning text-dark';
      case 'LDR': return 'bg-info';
      case 'Camara': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const getEventDescription = (event) => {
    const descriptions = {
      'movimiento_detectado': 'Movimiento detectado por sensor PIR',
      'objeto_detectado_foco_encendido': 'Objeto cercano detectado - Foco encendido',
      'objeto_fuera_rango_foco_apagado': 'Objeto fuera de rango - Foco apagado',
      'luz_detectada_foco_apagado': 'Luz ambiente detectada - Foco apagado automáticamente',
      'error_captura_imagen': 'Error al capturar imagen'
    };
    return descriptions[event] || event.replace(/_/g, ' ');
  };

  const getSensorStats = () => {
    const stats = {
      PIR: 0,
      Ultrasonico: 0,
      LDR: 0,
      Camara: 0
    };
    events.forEach(event => {
      if (stats.hasOwnProperty(event.sensor)) {
        stats[event.sensor]++;
      }
    });
    return stats;
  };

  const stats = getSensorStats();

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Eventos de Sensores</h2>
        <Badge bg="primary">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
        </Badge>
      </div>

      {/* Estadísticas por sensor */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card danger">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.PIR}</h4>
                  <small className="text-muted">Sensor PIR</small>
                </div>
                <FaWalking size={30} className="text-danger" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card warning">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.Ultrasonico}</h4>
                  <small className="text-muted">Ultrasónico</small>
                </div>
                <FaExclamationTriangle size={30} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card primary">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.LDR}</h4>
                  <small className="text-muted">Fotoresistencia</small>
                </div>
                <FaLightbulb size={30} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="stat-card success">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.Camara}</h4>
                  <small className="text-muted">Cámara</small>
                </div>
                <FaCamera size={30} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtro */}
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>
              <FaFilter className="me-2" />
              Filtrar por sensor
            </Form.Label>
            <Form.Select 
              value={selectedSensor} 
              onChange={(e) => setSelectedSensor(e.target.value)}
            >
              <option value="all">Todos los sensores</option>
              <option value="PIR">Sensor PIR (Movimiento)</option>
              <option value="Ultrasonico">Sensor Ultrasónico</option>
              <option value="LDR">Fotoresistencia (LDR)</option>
              <option value="Camara">Cámara</option>
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Lista de eventos */}
      {filteredEvents.length === 0 ? (
        <Alert variant="info">
          No hay eventos disponibles{selectedSensor !== 'all' ? ' para este sensor' : ''}
        </Alert>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col md={12} key={event.id} className="mb-3">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="mb-2">
                        {getSensorIcon(event.sensor)}
                        <span className="ms-2">{getEventDescription(event.event)}</span>
                        <Badge className={`${getSensorBadgeClass(event.sensor)} ms-2`}>
                          {event.sensor}
                        </Badge>
                      </h5>
                      <p className="text-muted mb-2">
                        <FaClock className="me-2" />
                        {event.timestamp}
                      </p>
                      {event.value && (
                        <Alert variant="light" className="mb-0 mt-2">
                          <strong>Distancia medida:</strong> {event.value} cm
                        </Alert>
                      )}
                      <small className="text-muted">
                        <strong>Dispositivo:</strong> {event.device}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default SensorEvents;
