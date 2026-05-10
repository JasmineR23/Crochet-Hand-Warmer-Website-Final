import { useState } from "react";
import axios from "axios";
import "./HandWarmer.css";

const HandWarmer = () => {
  const [form, setForm] = useState({
    hand_warmer_name: "",
    hand_warmer_quantity: "",
    hand_warmer_desc: "",
    hand_warmer_style: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [materials, setMaterials] = useState([
    {
      colour: "",
      distribution: [{ material: "", percent: "" }]
    }
  ]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

 
  const handleColourChange = (index, e) => {
    const updated = [...materials];
    updated[index].colour = e.target.value;
    setMaterials(updated);
  };


  const handleDistributionChange = (colourIndex, distIndex, e) => {
    const updated = [...materials];
    updated[colourIndex].distribution[distIndex][e.target.name] = e.target.value;
    setMaterials(updated);
  };


  const addColour = () => {
    setMaterials([
      ...materials,
      { colour: "", distribution: [{ material: "", percent: "" }] }
    ]);
  };

  const addDistribution = (colourIndex) => {
    const updated = [...materials];
    updated[colourIndex].distribution.push({ material: "", percent: "" });
    setMaterials(updated);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const newHandWarmer = {
      hand_warmer_name: form.hand_warmer_name,
      hand_warmer_quantity: Number(form.hand_warmer_quantity),
      hand_warmers_ordered: 0,
      hand_warmer_desc: form.hand_warmer_desc,
      hand_warmer_style: form.hand_warmer_style,
      hand_warmer_materials: materials
    };


    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("data", JSON.stringify(newHandWarmer));

    try {
      const res = await axios.post(
        "http://localhost:4000/handwarmers",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      alert("Hand warmer added successfully!");
      console.log(res.data);

    } catch (err) {
      console.error(err);
      alert("Error adding hand warmer");
    }
  };

  return (
    <div className="add-handwarmer-container">
      <h1>Add Hand Warmer</h1>

      <form onSubmit={handleSubmit} className="handwarmer-form">

        <input
          name="hand_warmer_name"
          placeholder="Hand Warmer Name"
          value={form.hand_warmer_name}
          onChange={handleChange}
        />

        <input
          name="hand_warmer_quantity"
          placeholder="Quantity"
          type="number"
          value={form.hand_warmer_quantity}
          onChange={handleChange}
        />


        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <input
          name="hand_warmer_style"
          placeholder="Style (solid, striped, etc.)"
          value={form.hand_warmer_style}
          onChange={handleChange}
        />

        <textarea
          name="hand_warmer_desc"
          placeholder="Description"
          value={form.hand_warmer_desc}
          onChange={handleChange}
        />

        <h3>Materials</h3>

        {materials.map((mat, colourIndex) => (
          <div key={colourIndex} className="material-section">

            <input
              placeholder="Colour"
              value={mat.colour}
              onChange={(e) => handleColourChange(colourIndex, e)}
            />

            <h4>Material Breakdown</h4>

            {mat.distribution.map((dist, distIndex) => (
              <div key={distIndex} className="distribution-row">
                <input
                  name="material"
                  placeholder="Material"
                  value={dist.material}
                  onChange={(e) =>
                    handleDistributionChange(colourIndex, distIndex, e)
                  }
                />

                <input
                  name="percent"
                  placeholder="Percent"
                  value={dist.percent}
                  onChange={(e) =>
                    handleDistributionChange(colourIndex, distIndex, e)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              className="add-material-btn"
              onClick={() => addDistribution(colourIndex)}
            >
              + Add Material to This Colour
            </button>
          </div>
        ))}

        <button type="button" className="add-material-btn" onClick={addColour}>
          + Add Another Colour
        </button>

        <button type="submit" className="submit-btn">
          Add Hand Warmer
        </button>
      </form>
    </div>
  );
}

export default HandWarmer

