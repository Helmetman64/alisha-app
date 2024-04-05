import React from "react";
import { Card } from "react-bootstrap";
import IMAGES from "../assets/images.js";

export default function CardItem({
  itemName,
  imageName,
  itemPrice,
  itemQTY,
  displayPrice,
}) {
  return (
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
    </Card>
  );
}
