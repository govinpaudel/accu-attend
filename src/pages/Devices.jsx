
import { useEffect, useState } from "react";
const Devices = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost/api/zkteco/getuser.php")
      .then(res => res.json()) // parses json.data automatically
      .then(json => {
        if (json.status) {
          setUsers(json.data); // <-- use the parsed object
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>ZKTeco Users</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>UID</th>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.uid}>
              <td>{u.uid}</td>
              <td>{u.user_id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Devices
