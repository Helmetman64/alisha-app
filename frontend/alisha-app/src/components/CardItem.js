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
    <Card className="card">
      <Card.Header className="card-header">
        {itemName} {displayPrice ? `$${itemPrice}` : `- Quantity: ${itemQTY}`}
      </Card.Header>
      <Card.Img
        variant="top"
        src={IMAGES[imageName]}
        alt={imageName}
        className="card-img-top"
      />
    </Card>
  );
}
