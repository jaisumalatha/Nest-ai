// "use client";

// export default function CompletionPage() {
//     return (
//         <div>
//             <h1>Completion Page</h1>
//            <div>
//                 <form>
//                     <input type="text" placeholder="Enter your prompt here" />
//                     <button type="submit">submit</button>
//                 </form>
//            </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      setResponse(data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Text Completion</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>

      {error && <p style={styles.error}>⚠️ {error}</p>}
      {response && (
        <div style={styles.responseBox}>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "system-ui, sans-serif",
    padding: "20px",
  },
  title: {
    textAlign: "center" as const,
    color: "white",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
     backgroundColor: "white",
     color: "black",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  responseBox: {
    backgroundColor: "#f4f4f4",
    marginTop: "20px",
    padding: "15px",
    borderRadius: "6px",
     color: "black",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};
