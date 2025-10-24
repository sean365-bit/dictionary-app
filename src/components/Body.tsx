import { useState } from "react";
import axios from "axios";

type Phonetic = { text?: string; audio?: string };
type Definition = { definition: string; example?: string; synonyms?: string[] };
type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
};
type Entry = { word: string; phonetics?: Phonetic[]; meanings: Meaning[] };
type Status = "idle" | "loading" | "success" | "error";

export default function Body() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Entry[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  async function fetchWord(word: string, signal?: AbortSignal) {
    setStatus("loading");
    setError(null);
    try {
      const res = await axios.get<Entry[]>(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word
        )}`,
        { signal }
      );
      setData(res.data);
      setStatus("success");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        const msg =
          data?.message ||
          err.response?.statusText ||
          err.message ||
          "Something went wrong";
        setError(msg);
      } else {
        setError("Something went wrong");
      }
      setStatus("error");
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setValidationError("Whoops,can't be empty...");
      return;
    }

    setValidationError(null);
    const controller = new AbortController();
    fetchWord(trimmed, controller.signal);
  };

  const entry = data?.[0];

  const ipa =
    entry?.phonetics?.find((p) => p.text)?.text ??
    entry?.phonetics?.[0]?.text ??
    null;

  const audioUrl =
    entry?.phonetics
      ?.map((p) => p.audio?.trim())
      .find((a): a is string => !!a && /^https?:\/\//i.test(a)) ?? null;

  const nounMeanings =
    entry?.meanings.filter((m) => m.partOfSpeech === "noun") ?? [];
  const verbMeanings =
    entry?.meanings.filter((m) => m.partOfSpeech === "verb") ?? [];

  const playAudio = async (url: string) => {
    try {
      const audio = new Audio(url);
      await audio.play();
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1rem" }}>
      <form onSubmit={onSubmit} aria-busy={status === "loading"}>
        <label htmlFor="word" style={{ display: "block", fontWeight: 600 }}>
          Search a word
        </label>

        <div style={{ display: "flex", gap: ".5rem", marginTop: ".25rem" }}>
          <input
            id="word"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setValidationError(null);
            }}
            placeholder="Search for a word..."
            style={{ flex: 1, padding: ".5rem" }}
          />
          <button type="submit">
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Validation message */}
        {validationError && (
          <p style={{ color: "crimson", marginTop: ".25rem" }}>
            {validationError}
          </p>
        )}
      </form>

      {/* Show nothing on first render */}
      {status === "idle" && !data && !error && (
        <section
          aria-live="polite"
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #eee",
            borderRadius: 12,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Welcome 👋</h3>
          <h3 style={{ marginTop: 0 }}>What word are you looking for?</h3>
          <p>
            Type a word above and press <kbd>Enter</kbd> to search.
          </p>
        </section>
      )}

      {status === "loading" && <p style={{ marginTop: "1rem" }}>Loading…</p>}

      {status === "error" && (
        <p style={{ marginTop: "1rem", color: "crimson" }}>Error: {error}</p>
      )}

      {status === "success" && entry && (
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <h2 style={{ margin: 0 }}>{entry.word}</h2>

            {audioUrl && (
              <button type="button" onClick={() => playAudio(audioUrl)}>
                🔊 Play Audio
              </button>
            )}

            {ipa && <span style={{ opacity: 0.7 }}>{ipa}</span>}
          </div>

          {nounMeanings.length > 0 && (
            <section style={{ marginTop: "1rem" }}>
              <h3>Noun</h3>
              <ol>
                {nounMeanings.flatMap((m, i) =>
                  m.definitions.map((d, j) => (
                    <li key={`noun-${i}-${j}`}>{d.definition}</li>
                  ))
                )}
              </ol>
              {nounMeanings.some((m) => m.synonyms?.length) && (
                <p>
                  <strong>Synonyms:</strong>{" "}
                  {nounMeanings
                    .flatMap((m) => m.synonyms ?? [])
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
            </section>
          )}

          {verbMeanings.length > 0 && (
            <section style={{ marginTop: "1rem" }}>
              <h3>Verb</h3>
              <ol>
                {verbMeanings.flatMap((m, i) =>
                  m.definitions.map((d, j) => (
                    <li key={`verb-${i}-${j}`}>
                      <div>{d.definition}</div>
                      {d.example && (
                        <div style={{ opacity: 0.8 }}>
                          <em>Example:</em> “{d.example}”
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
