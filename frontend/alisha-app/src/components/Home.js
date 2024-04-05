import React, { useState, useEffect } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import IMAGES from "../assets/images.js";
import {
  updateStockQuantity,
  recordSale,
  fetchItems,
} from "../services/service.js"; // Import necessary functions

export default function Home() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clickCounts, setClickCounts] = useState({});
  const [itemsToSell, setItemsToSell] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [clickCounts, itemsToSell]);

  const fetchData = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
      // Initialize click counts for each item
      const counts = {};
      data.forEach((item) => (counts[item.itemID] = 0));
      setClickCounts(counts);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleSell = () => {
    setShowModal(true);
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
    setItemsToSell([]);
    setClickCounts({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setItemsToSell([]);
    setClickCounts({});
  };

  const handleConfirmSell = async () => {
    try {
      console.log("Items to sell:", itemsToSell);

      let totalSalePrice = 0; // Initialize total sale price

      // Record the sale in the database
      const currentDate = new Date();
      const formattedSaleDate = `${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")} ${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${currentDate.getFullYear()}`;

      await Promise.all(
        itemsToSell.map(async (item) => {
          let itemSalePrice = 0; // Initialize sale price for this item
          if (item.itemName !== "Duck") {
            // Exclude special pricing for ducks
            itemSalePrice = item.itemPrice * clickCounts[item.itemID]; // Calculate sale price for this item
          } else {
            // Handle special pricing for ducks separately
            const quantity = clickCounts[item.itemID] || 0;
            const setsOfTwo = Math.floor(quantity / 2); // Calculate sets of 2 ducks
            itemSalePrice = setsOfTwo * 35; // $35 for each set of 2 ducks
            if (quantity % 2 !== 0) {
              itemSalePrice += 20; // Add $20 for the remaining duck if not an even number
            }
          }

          // Record sale for this item
          const saleData = {
            itemID: item.itemID,
            itemName: item.itemName,
            salePrice: itemSalePrice,
            qtySold: clickCounts[item.itemID],
            saleDate: formattedSaleDate,
          };
          await recordSale(saleData);

          // Add sale price of this item to total sale price
          totalSalePrice += itemSalePrice;
        })
      );

      // Update stock quantity in the database
      await Promise.all(
        itemsToSell.map(async (item) => {
          const newQuantity = item.itemQTY - clickCounts[item.itemID];
          await updateStockQuantity(item.itemID, newQuantity);
        })
      );

      setShowModal(false);
      setShowConfirmationModal(true); // Show confirmation modal
      setSelectedItem(null);
      setTotalPrice(totalSalePrice); // Set total sale price
    } catch (error) {
      console.error("Error selling items:", error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    // Increment click count for the clicked item
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [item.itemID]: (prevCounts[item.itemID] || 0) + 1,
    }));
    setItemsToSell((prevItems) => {
      const updatedItems = [...prevItems];
      const itemIndex = updatedItems.findIndex(
        (existingItem) => existingItem.itemID === item.itemID
      );
      if (itemIndex !== -1) {
        updatedItems[itemIndex].quantity++;
      } else {
        updatedItems.push({ ...item, quantity: 1 });
      }
      return updatedItems.filter((item) => item.quantity > 0); // Filter out items with quantity 0
    });
  };

  const handleQuantityDecrement = (itemID) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [itemID]: (prevCounts[itemID] || 0) - 1,
    }));
    setItemsToSell((prevItems) => {
      const updatedItems = prevItems
        .map((item) => {
          if (item.itemID === itemID) {
            const newQuantity = (clickCounts[itemID] || 0) - 1;
            if (newQuantity <= 0) {
              return null; // Remove the item if quantity becomes 0 or negative
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean); // Filter out null items

      // Check if there are no more items left
      if (updatedItems.length === 0) {
        handleCloseModal(); // Close the modal if no items left
      }

      return updatedItems;
    });
  };

  const calculatePrice = () => {
    let calculatedPrice = 0;

    itemsToSell.forEach((item) => {
      const quantity = clickCounts[item.itemID] || 0; // Handle cases when quantity is undefined
      if (quantity > 0) {
        if (item.itemName === "Duck") {
          // Special deal for ducks: $35 for 2, $70 for 4, and so on
          const setsOfTwo = Math.floor(quantity / 2); // Calculate sets of 2 ducks
          calculatedPrice += setsOfTwo * 35; // $35 for each set of 2 ducks
          if (quantity % 2 !== 0) {
            calculatedPrice += 20; // Add $20 for the remaining duck if not an even number
          }
        } else {
          calculatedPrice += quantity * item.itemPrice;
        }
      }
    });

    setTotalPrice(calculatedPrice);
  };

  return (
    <div className="body">
      <div>
        <h2>Total Price: ${totalPrice}</h2>
      </div>
      <div>
        <h2>Items to Sell:</h2>
        <ul>
          {itemsToSell.map((item) => (
            <li key={item.itemID}>
              {item.itemName} - Quantity: {clickCounts[item.itemID]}
            </li>
          ))}
        </ul>
      </div>
      {items.map((item) => (
        <Card
          key={item.itemID}
          border="primary"
          style={{ width: "18rem", cursor: "pointer" }}
          onClick={() => handleCardClick(item)}
        >
          <Card.Header>
            {item.itemName} ${item.itemPrice}
          </Card.Header>
          <Card.Img
            variant="top"
            src={IMAGES[item.imageName]}
            alt={item.imageName}
            style={{ width: "100%" }}
          />
        </Card>
      ))}
      {itemsToSell.length > 0 && (
        <Button variant="danger" onClick={handleSell}>
          Sell
        </Button>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemsToSell.map((item, index) => (
            <div key={index}>
              <span>
                {item.itemName} - Quantity: {clickCounts[item.itemID]}
              </span>
              <Button
                variant="outline-danger"
                onClick={() => handleQuantityDecrement(item.itemID)}
              >
                -
              </Button>
            </div>
          ))}
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

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sell</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemsToSell.map((item, index) => (
            <div key={index}>
              <span>
                {item.itemName} - Quantity: {clickCounts[item.itemID]}
              </span>
              <Button
                variant="outline-danger"
                onClick={() => handleQuantityDecrement(item.itemID)}
              >
                -
              </Button>
            </div>
          ))}
          <div>
            <h4>Total Price: ${totalPrice}</h4>
          </div>
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

      <Modal show={showConfirmationModal} onHide={handleConfirmationModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sold!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Items have been sold successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmationModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
