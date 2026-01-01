import { useEffect, useState } from "react";
import api from "../api/api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const res = await api.get("/stores");
    setStores(res.data.data);
  };

  const addStore = async () => {
    await api.post("/stores", {
      name,
      latitude: lat,
      longitude: lng,
      radius: 20,
    });
    loadStores();
  };

  return (
    <div>
      <h2>Stores</h2>

      <input placeholder="Store Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Latitude" onChange={e => setLat(e.target.value)} />
      <input placeholder="Longitude" onChange={e => setLng(e.target.value)} />
      <button onClick={addStore}>Add Store</button>

      <ul>
        {stores.map(s => (
          <li key={s.id}>
            {s.name} ({s.latitude},{s.longitude})
          </li>
        ))}
      </ul>
    </div>
  );
}
