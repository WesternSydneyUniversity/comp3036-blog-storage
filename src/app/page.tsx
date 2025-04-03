"use client";

import { useEffect, useState } from "react";
import Draft from "./components/Draft";
import { Login } from "./components/Login";
import SavePrefs from "./components/SavePrefs";
import { loadDrafts, saveDraft } from "./lib/draftsDB";

export default function Home() {
  const [drafts, setDrafts] = useState<{ id: number; text: string }[]>([]);
  const [cookieSessionStatus, setCookieSessionStatus] =
    useState<string>("Checking cookie...");
  const [jwtSessionStatus, setJwtSessionStatus] =
    useState<string>("Checking jwt...");

  useEffect(() => {
    // retrieve cookie session status from the server
    fetch("/api/check-session/cookie", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
    }).then((res) =>
      res.json().then((data) => setCookieSessionStatus(data.message))
    );

    // retrieve JWT session status from the server
    fetch("/api/check-session/jwt", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
      },
    }).then((res) =>
      res.json().then((data) => {
        setJwtSessionStatus(data.message);
        if (data.token) {
          localStorage.setItem("sessionToken", data.token);
        }
      })
    );

    loadDrafts(setDrafts);
  }, []);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <h1>Blog Storage Exercise</h1>
      <Login
        setCookieSessionStatus={setCookieSessionStatus}
        setJwtSessionStatus={setJwtSessionStatus}
      />
      <p>Cookie Session: {cookieSessionStatus}</p>
      <p>JWT Session: {jwtSessionStatus}</p>
      <SavePrefs />
      <Draft />
      <div>
        <h2>Saved Drafts (IndexedDB)</h2>
        <button onClick={() => saveDraft("New draft " + Date.now())}>
          Save Draft
        </button>
        <ul>
          {drafts.map((d) => (
            <li key={d.id}>{d.text}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
