"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

interface CustomModalProps {
  title?: string;
  children: React.ReactNode;
  openModal: boolean;
  onCloseModal: () => void,
  isConfirm?: Boolean
}

export default function CustomModal({ title = 'Terms of Service', children, openModal, onCloseModal, isConfirm = false }: CustomModalProps) {

  return (
    <Modal show={openModal} onClose={onCloseModal}>
      {!isConfirm && <Modal.Header>{title}</Modal.Header>}
      <Modal.Body className="p-0">
        <div className={isConfirm ? 'space-y-6' : ''}>
          {children}
        </div>
      </Modal.Body>
      {!isConfirm && <Modal.Footer></Modal.Footer>}
    </Modal>
  );
}
