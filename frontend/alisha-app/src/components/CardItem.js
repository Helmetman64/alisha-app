import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IMAGES from "../assets/images.js";
import { updateStockQuantity, recordSale } from "../services/service.js";

export default function CardItem({
  itemID,
  itemName,
  imageName,
  itemPrice,
  itemQTY,
  showControls,
  displayPrice,
}) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorModal, setErrorModal] = useState(false);

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

  const handleConfirmSell = async () => {
    try {
      // Calculate the new quantity after selling
      const newQuantity = itemQTY - quantity;

      // Perform the API request to update the database
      await updateStockQuantity(itemID, newQuantity);

      // Format the sale date
      const saleDate = new Date().toISOString();

      // Perform the API request to add a sale record
      const saleData = {
        itemID: itemID,
        itemName: itemName,
        salePrice: totalPrice,
        qtySold: quantity,
        saleDate: saleDate,
      };
      await recordSale(saleData);

      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error selling item:", error);
      // Handle error (e.g., show error message to the user)
    }
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
      <Card border="primary" style={{ width: "18rem" }}>
        <Card.Header>
          {itemName} {displayPrice ? `$${itemPrice}` : `- Quantity: ${itemQTY}`}
        </Card.Header>
        <Card.Img
          variant="top"
          src={IMAGES[imageName]}
          alt={imageName}
          style={{ width: "100%" }}
        />
        {showControls && (
          <>
            <Button variant="danger" onClick={handleSell}>
              Sell
            </Button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </>
        )}
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
