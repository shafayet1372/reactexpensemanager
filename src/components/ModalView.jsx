import React from "react";
import { Modal } from "react-bootstrap";
export default function ModalView({ show, children, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}
