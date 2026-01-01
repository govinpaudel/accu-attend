import { useEffect, useState } from "react";
import api from "../api/api";

export default function Roster() {
  const [users, setUsers] = useState([]);
  const [shiftId, setShiftId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setUsers(res.data.data));
  }, []);

  const assignRoster = async () => {
    await api.post("/roster", {
      users: selectedUsers,
      shift_id: shiftId,
    });
    alert("Roster Assigned");
  };

  return (
    <div>
      <h2>Duty Roster</h2>

      <input placeholder="Shift ID" onChange={e => setShiftId(e.target.value)} />

      {users.map(u => (
        <div key={u.id}>
          <input
            type="checkbox"
            onChange={e => {
              if (e.target.checked) {
                setSelectedUsers([...selectedUsers, u.id]);
              } else {
                setSelectedUsers(selectedUsers.filter(id => id !== u.id));
              }
            }}
          />
          {u.username}
        </div>
      ))}

      <button onClick={assignRoster}>Assign</button>
    </div>
  );
}
