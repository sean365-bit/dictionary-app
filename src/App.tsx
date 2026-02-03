// App.tsx
import { useState } from "react";
import "./styles/App.scss";
import Header from "./components/Header";
import Body from "./components/Body";

function App() {
  const [selectedFont, setSelectedFont] = useState<string>("Sans Serif");

  return (
    <div className="app">
      <Header selectedFont={selectedFont} onFontChange={setSelectedFont} />
      <Body selectedFont={selectedFont} />
    </div>
  );
}

export default App;
