import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IMAGES from "../assets/images.js";

export default function CardItem({ itemName, imageName, variant, itemPrice }) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorModal, setErrorModal] = useState(false);

  // Function to handle the sell button click
  const handleSell = () => {
    if (quantity <= 0) {
      setErrorModal(true);
    } else {
      setShowModal(true);
      calculatePrice();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmSell = () => {
    // Perform the sell operation here
    setShowModal(false);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    setQuantity(value);
  };

  const calculatePrice = () => {
    let calculatedPrice = 0;

    // Check for special deals
    if (itemName === "Duck") {
      // Special deal for ducks: $35 for 2, $70 for 4, and so on
      const setsOfTwo = Math.floor(quantity / 2); // Calculate sets of 2 ducks
      calculatedPrice = setsOfTwo * 35; // $35 for each set of 2 ducks
      if (quantity % 2 !== 0) {
        calculatedPrice += 20; // Add $20 for the remaining duck if not an even number
      }
    } else {
      calculatedPrice = quantity * itemPrice;
    }

    setTotalPrice(calculatedPrice);
  };

  return (
    <>
      {/* Card component to display items */}
      <Card border={variant} style={{ width: "10rem" }}>
        <Card.Header>
          {itemName} ${itemPrice}
        </Card.Header>
        <Card.Img
          variant="top"
          src={IMAGES[imageName]}
          alt={imageName}
          style={{ width: "100%" }}
        />
        <Button variant="danger" onClick={handleSell}>
          Sell
        </Button>
        <input type="number" value={quantity} onChange={handleQuantityChange} />
      </Card>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to sell {quantity} {itemName} for ${totalPrice}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmSell}>
            Sell
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={errorModal} onHide={() => setErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>Quantity must be greater than 0!</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
