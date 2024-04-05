import React, { useState, useEffect } from "react";
import { fetchItems, addItem, updateStockQuantity } from "../services/service";
import {
  Button,
  Form,
  Modal,
  Row,
  Col,
  Card,
  Container,
} from "react-bootstrap";
import IMAGES from "../assets/images";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQTY, setItemQTY] = useState("");
  const [errors, setErrors] = useState({
    itemName: "",
    itemPrice: "",
    itemQTY: "",
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

  const handleSelectedItemChange = (e) => {
    const selectedItem = e.target.value;
    setSelectedItem(selectedItem);
    const selectedItemData = items.find(
      (item) => item.itemName === selectedItem
    );
    if (selectedItemData) {
      setItemPrice(selectedItemData.itemPrice);
      setItemQTY(selectedItemData.itemQTY);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!selectedItem) {
      newErrors.itemName = "Please select an item";
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

    setErrors(newErrors);
    return isValid;
  };

  const confirmAddStock = async () => {
    if (!validateForm()) {
      return;
    }

    const selectedItemData = items.find(
      (item) => item.itemName === selectedItem
    );

    await updateStockQuantity(selectedItemData.itemID, itemQTY);
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
    <Container fluid>
      <h1>Stock</h1>
      <div className="body">
        <Row>
          {items.map((item) => (
            <Col key={item.itemID} xs={12} sm={6} md={6} lg={4} xl={3}>
              <Card key={item.itemID} border="primary" className="mb-3">
                <Card.Header>
                  {item.itemName} - Quantity {item.itemQTY}{" "}
                </Card.Header>
                <Card.Img
                  variant="top"
                  src={IMAGES[item.imageName]}
                  alt={item.imageName}
                  className="duck"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Button onClick={handleAddStock}>Add Stock</Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSelectedItem">
              <Form.Label>Select Item</Form.Label>
              <Form.Control
                as="select"
                value={selectedItem}
                onChange={handleSelectedItemChange}
                className={errors.itemName ? "is-invalid" : ""}
              >
                <option value="">Select...</option>
                {items.map((item) => (
                  <option key={item.itemID} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))}
              </Form.Control>
              {errors.itemName && (
                <div className="invalid-feedback">{errors.itemName}</div>
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
          <p>The item has been successfully updated.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseConfirmationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
