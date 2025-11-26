import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, Modal, Button } from 'react-bootstrap';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { database } from '../firebase';
import { FaCamera, FaClock, FaExpand } from 'react-icons/fa';

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const photosRef = ref(database, 'eventos/fotos');
    const photosQuery = query(photosRef, orderByChild('timestamp'));

    const unsubscribe = onValue(photosQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const photosArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setPhotos(photosArray.reverse());
      } else {
        setPhotos([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPhoto(null);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Galería de Fotos</h2>
        <span className="badge bg-primary">
          {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
        </span>
      </div>

      {photos.length === 0 ? (
        <Alert variant="info">
          <FaCamera className="me-2" />
          No hay fotos disponibles en este momento
        </Alert>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-card" onClick={() => handlePhotoClick(photo)}>
              <img
                src={`data:image/jpeg;base64,${photo.image}`}
                alt={`Captura ${photo.timestamp}`}
              />
              <div className="photo-overlay">
                <div className="d-flex justify-content-between align-items-center">
                  <small>
                    <FaClock className="me-1" />
                    {photo.timestamp}
                  </small>
                  <FaExpand />
                </div>
                <small className="d-block mt-1">
                  {photo.width} x {photo.height}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver foto en grande */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCamera className="me-2" />
            Detalles de la Captura
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhoto && (
            <>
              <img
                src={`data:image/jpeg;base64,${selectedPhoto.image}`}
                alt={`Captura ${selectedPhoto.timestamp}`}
                className="w-100 mb-3"
                style={{ borderRadius: '8px' }}
              />
              <Row>
                <Col md={6}>
                  <p><strong>Dispositivo:</strong> {selectedPhoto.device}</p>
                  <p><strong>Fecha y Hora:</strong> {selectedPhoto.timestamp}</p>
                  <p><strong>Tipo:</strong> {selectedPhoto.type}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Resolución:</strong> {selectedPhoto.width} x {selectedPhoto.height}</p>
                  <p><strong>Tamaño:</strong> {(selectedPhoto.size / 1024).toFixed(2)} KB</p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PhotoGallery;
