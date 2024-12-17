import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [flavors, setFlavors] = useState("");
  const [getFlavors, setGetFlavors] = useState([]);
  const [favoriteFlavor, setFavoriteFlavor] = useState("");

  async function getflavors() {
    try {
      const response = await fetch("http://localhost:3000/api/flavors");
      const data = await response.json();
      console.log("data: ", data);
      setGetFlavors(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getflavors();
  }, []);

  function submitHandler(e) {
    e.preventDefault();
    console.log("flavor is: ", flavors);
    console.log("favorite is: ", favoriteFlavor);

    let isFavorite;

    if (favoriteFlavor === "Yes") {
      isFavorite = true;
    } else {
      isFavorite = false;
    }

    const obj = {
      flavor_name: flavors,
      is_favorite: isFavorite,
    };

    async function addFlavor(obj) {
      try {
        const response = await fetch("http://localhost:3000/api/flavors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });
        console.log("data has been sent!");
        getflavors();
      } catch (error) {
        console.log("error while sending flavor ", error);
      }
    }
    addFlavor(obj);
    setFavoriteFlavor("");
    setFlavors("");
  }

  return (
    <>
      <div className="main-container">
        <h1>Ice Cream Flavors</h1>
        <div className="form">
          <form onSubmit={submitHandler}>
            <label>Flavor Name:</label>
            <input
              value={flavors}
              type="text"
              onChange={(e) => setFlavors(e.target.value)}
            />
            <label>Is it your Favorite: </label>
            <div className="yes-radio">
              <input
                checked={favoriteFlavor === "Yes"}
                name="favorite"
                type="radio"
                value="Yes"
                onChange={(e) => setFavoriteFlavor(e.target.value)}
              />
              <label>Yes</label>
            </div>
            <div className="no-radio">
              <input
                checked={favoriteFlavor === "No"}
                name="favorite"
                type="radio"
                value="No"
                onChange={(e) => setFavoriteFlavor(e.target.value)}
              />
              <label>No</label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="container">
          {getFlavors.map((flavor) => (
            <div key={flavor.id} className="flavor-container">
              <div className="image-container">
                <img
                  src="https://wallpapercave.com/wp/wp2992539.jpg"
                  alt="A Picture of a Ice Cream"
                />
              </div>
              <div className="flavor">
                <p> {flavor.flavor_name} </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
