import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => data.subscription.unsubscribe();
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setMessage(error ? error.message : "Account created!");
  }

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) setUser(data.user);
    setMessage(error ? error.message : "Welcome to Rycord!");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <main style={{
      background: "#313338",
      color: "white",
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      fontFamily: "Arial"
    }}>
      <section style={{
        background: "#2b2d31",
        padding: "35px",
        borderRadius: "12px",
        width: "300px"
      }}>
        <h1>Rycord</h1>
        {user ? (
          <>
            <p>Welcome to Rycord!</p>
            <p>{user.email}</p>
            <button onClick={signOut}>Sign out</button>
          </>
        ) : (
          <>
            <h2>Welcome back!</h2>
            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={signIn}>Log in</button>
            <button onClick={signUp}>Create account</button>
          </>
        )}
        <p>{message}</p>
      </section>
    </main>
  );
}
