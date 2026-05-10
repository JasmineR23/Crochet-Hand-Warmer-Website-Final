import React, { useEffect, useState } from "react";
import "./Products.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [handWarmers, setHandWarmers] = useState([]);
  const [selectedColours, setSelectedColours] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/handwarmers")
      .then((res) => setHandWarmers(res.data))
      .catch((err) => console.error("Failed to fetch hand warmers:", err));
  }, []);

  const handleColourChange = (colour) => {
    setSelectedColours((prev) =>
      prev.includes(colour)
        ? prev.filter((c) => c !== colour)
        : [...prev, colour]
    );
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handlePatternChange = (pattern) => {
    setSelectedPattern((prev) =>
      prev.includes(pattern)
        ? prev.filter((p) => p !== pattern)
        : [...prev, pattern]
    );
  };


  const filteredWarmers = handWarmers.filter((item) => {
    const details = item.materialDetails ?? [];


    const itemColours = details.map((m) =>
      m.colour?.toLowerCase().trim()
    );


    const itemMaterials = details.flatMap((m) =>
      m.distribution?.map((d) =>
        d.material?.toLowerCase().trim()
      ) ?? []
    );


    const itemPattern = item.style?.toLowerCase().trim() ?? "";


    const matchesColour =
      selectedColours.length === 0 ||
      selectedColours.some((col) =>
        itemColours.includes(col.toLowerCase())
      );


    const matchesMaterial =
      selectedMaterials.length === 0 ||
      selectedMaterials.some((mat) =>
        itemMaterials.some((m) =>
          m.includes(mat.toLowerCase())
        )
      );


    const matchesPattern =
      selectedPattern.length === 0 ||
      selectedPattern.some((pat) =>
        itemPattern.includes(pat.toLowerCase())
      );

    return matchesColour && matchesMaterial && matchesPattern;
  });

  return (
    <div className="products-elements">
      <div className="filter">
        <h3>Colour</h3>
        <ul className="colour-options">
          {[
            "red",
            "denim fleck",
            "dusted rose",
            "light green",
            "brown",
            "dark green",
            "cinnamon",
            "pink",
          ].map((colour) => (
            <li key={colour}>
              <input
                type="checkbox"
                checked={selectedColours.includes(colour)}
                onChange={() => handleColourChange(colour)}
              />
              {colour.charAt(0).toUpperCase() + colour.slice(1)}
            </li>
          ))}
        </ul>

        <h3>Style</h3>
        <ul className="style-options">
          <li>
            <input
              type="checkbox"
              checked={selectedPattern.includes("striped")}
              onChange={() => handlePatternChange("striped")}
            />
            Striped
          </li>
          <li>
            <input
              type="checkbox"
              checked={selectedPattern.includes("solid")}
              onChange={() => handlePatternChange("solid")}
            />
            Solid
          </li>
        </ul>

        <h3>Material</h3>
        <ul className="material-options">
          {[
            "cotton",
            "wool",
            "acrylic",
            "merino wool",
            "polyester",
            "tweed",
          ].map((mat) => (
            <li key={mat}>
              <input
                type="checkbox"
                checked={selectedMaterials.includes(mat)}
                onChange={() => handleMaterialChange(mat)}
              />
              {mat.charAt(0).toUpperCase() + mat.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="products" id="products">
        <h1>Explore a variety of hand warmers</h1>

        <div className="hand-warmers-list">
          {filteredWarmers.map((item) => (
            <div key={item.id} className="hand-warmer-item">
              <div className="image-name">
                <img
                  className="hand-warmer-image"
                  src={`http://localhost:4000/uploads/${item.image}`}
                  alt={item.name}
                />
                <Link to={`/item/${item.id}`} className="hand-warmer-name">
                  {item.name}
                </Link>
              </div>
            </div>
          ))}

          {filteredWarmers.length === 0 && (
            <p className="no-results">No items match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
