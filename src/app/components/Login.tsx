import { useState } from "react";

export function Login({
  setCookieSessionStatus,
  setJwtSessionStatus,
}: {
  setCookieSessionStatus: (status: string) => void;
  setJwtSessionStatus: (status: string) => void;
}) {
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<string>("");

  return (
    <>
      <div>
        <label htmlFor="username">User:</label>
        <input
          type="text"
          id="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() =>
            fetch("/api/login/cookie", {
              method: "POST",
              body: JSON.stringify({ password, user }),
              headers: { "Content-Type": "application/json" },
            }).then((res) =>
              res
                .json()
                .then((data) => {
                  setCookieSessionStatus(data.message);
                })
                .catch((err) => {
                  console.error("Error:", err);
                  setCookieSessionStatus("Error: " + err.message);
                })
            )
          }
        >
          Login (Sets Cookie)
        </button>
        <button
          onClick={() => {
            fetch("/api/logout/cookie", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            })
              .then((res) => {
                if (res.ok) {
                  window.location.reload();
                } else {
                  res.json().then((data) => {
                    setCookieSessionStatus("Error: " + data.message);
                  });
                }
              })
              .catch((err) => {
                console.error("Error:", err);
                setCookieSessionStatus("Error: " + err.message);
              });
          }}
        >
          Logout (Remove Cookie)
        </button>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() =>
            fetch("/api/login/jwt", {
              method: "POST",
              body: JSON.stringify({ password, user }),
              headers: { "Content-Type": "application/json" },
            }).then((res) =>
              res
                .json()
                .then((data) => {
                  localStorage.setItem("sessionToken", data.token);
                  setJwtSessionStatus(data.message);
                })
                .catch((err) => {
                  console.error("Error:", err);
                  setJwtSessionStatus("Error: " + err.message);
                })
            )
          }
        >
          Login (JWT)
        </button>
        <button
          onClick={() => {
            fetch("/api/logout/jwt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            })
              .then((res) => {
                if (res.ok) {
                  localStorage.removeItem("sessionToken");
                  window.location.reload();
                } else {
                  res.json().then((data) => {
                    setJwtSessionStatus("Error: " + data.message);
                  });
                }
              })
              .catch((err) => {
                console.error("Error:", err);
                setJwtSessionStatus("Error: " + err.message);
              });
          }}
        >
          Logout (JWT)
        </button>
      </div>
    </>
  );
}
