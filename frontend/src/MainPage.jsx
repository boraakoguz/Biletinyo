import { useEffect, useState } from "react";

function MainPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/applications")
      .then((res) => res.json())
      .then(setApplications)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Student Applications</h1>
      <ul>
        {applications.map((app, index) => (
          <li key={index}>
            {app.sname} ({app.sid}) applied to {app.cname} ({app.cid})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MainPage;
