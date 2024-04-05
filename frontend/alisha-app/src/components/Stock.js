import React, { useState, useEffect } from "react";
import { fetchItems, addItem } from "../services/service";
import CardItem from "./CardItem";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQTY, setItemQTY] = useState("");
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({
    itemName: "",
    itemPrice: "",
    itemQTY: "",
    imageName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddStock = () => {
    setShowModal(true);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!itemName) {
      newErrors.itemName = "Item Name is required";
      isValid = false;
    }

    if (!itemPrice || isNaN(itemPrice) || parseFloat(itemPrice) <= 0) {
      newErrors.itemPrice = "Item Price must be a positive number";
      isValid = false;
    }

    if (
      !itemQTY ||
      isNaN(itemQTY) ||
      parseInt(itemQTY) <= 0 ||
      !Number.isInteger(parseFloat(itemQTY))
    ) {
      newErrors.itemQTY = "Item Quantity must be a positive integer";
      isValid = false;
    }

    if (!imageName) {
      newErrors.imageName = "Image Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const confirmAddStock = async () => {
    if (!validateForm()) {
      return;
    }

    const itemData = {
      itemName: itemName,
      itemPrice: itemPrice,
      itemQTY: itemQTY,
      imageName: imageName,
    };
    await addItem(itemData);
    setShowModal(false);
    setShowConfirmationModal(true);
    // Refresh data after adding new item
    fetchData();
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="body">
        <h1>Stock</h1>
        {items.map((item) => (
          <CardItem
            key={item.itemId}
            itemName={item.itemName}
            itemPrice={item.itemPrice}
            imageName={item.imageName}
            itemQTY={item.itemQTY}
          />
        ))}
      </div>
      <Button onClick={handleAddStock}>Add Stock</Button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={errors.itemName ? "is-invalid" : ""}
              />
              {errors.itemName && (
                <div className="invalid-feedback">{errors.itemName}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Item Price</Form.Label>
              <Form.Control
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter item price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className={errors.itemPrice ? "is-invalid" : ""}
              />
              {errors.itemPrice && (
                <div className="invalid-feedback">{errors.itemPrice}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formItemQTY">
              <Form.Label>Item Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Enter item quantity"
                value={itemQTY}
                onChange={(e) => setItemQTY(e.target.value)}
                className={errors.itemQTY ? "is-invalid" : ""}
              />
              {errors.itemQTY && (
                <div className="invalid-feedback">{errors.itemQTY}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formImageName">
              <Form.Label>Image Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image name"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className={errors.imageName ? "is-invalid" : ""}
              />
              {errors.imageName && (
                <div className="invalid-feedback">{errors.imageName}</div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAddStock}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Item Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The item has been successfully added to the stock.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseConfirmationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
