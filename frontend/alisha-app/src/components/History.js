import React, { useEffect, useState } from "react";
import { fetchSales } from "../services/service";

export default function History() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const salesData = await fetchSales();
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  // Function to format the date in the format HH:MM DD/MM/YYYY

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const formatSaleDescription = (qtySold, itemName, salePrice, saleDate) => {
    const formattedDate = formatDate(saleDate);
    const formattedPrice = Number(salePrice).toFixed(2);
    let itemLabel = itemName;
    if (itemName === "Miffy plush" && qtySold > 1) {
      itemLabel = "Miffy plushies";
    } else {
      itemLabel = qtySold === 1 ? itemName : `${itemName}s`;
    }
    const saleDescription = `${qtySold} ${itemLabel} ${
      qtySold === 1 ? "was" : "were"
    } sold for $${formattedPrice} on ${formattedDate}`;
    return saleDescription;
  };

  return (
    <div className="sales">
      <br />
      <h2>Sales: </h2>
      <br />
      {sales.map((sale) => (
        <p key={sale.saleID}>
          {formatSaleDescription(
            sale.qtySold,
            sale.itemName,
            sale.salePrice,
            sale.saleDate
          )}
        </p>
      ))}
    </div>
  );
}
