// React Hooks
import { useState } from "react";
// Custom Hooks
import { useFetch, useInput } from "./hooks/hooks"
// Components
import HAL9000 from "./components/HAL9000/HAL9000"
import Footer from "./components/Footer/Footer";

const App = () => {
  const [speech, setSpeech] = useState(false)
  const [text, setText] = useState(false)
  const [src, setSrc] = useState(false)

  const [value, textEl] = useInput({ type: "text" });

  const pipeline = [setSpeech, setText, setSrc]

  // useFetch({
  //   url: "https://api.publicapis.org/entries",
  //   responseType: "blob",
  //   data: speech,
  //   unsetData: setSpeech,
  //   setData: setSrc,
  // })

  console.log(src)
  useFetch({
    url: "http://34.130.94.99:5000/api/hal9000",
    data: text,
    unsetData: setText,
    setData: setSrc,
  })
  function reset() {
    pipeline.forEach(setFunction => {
      setFunction(false)
    })
  }

  return (
    <>
    <audio autoPlay={true} id="audio" controls src={src ? src : null} />
    {textEl}
    <button onClick={() => setText(value)}/>
    <Footer/>
    </>
  );
};

export default App;
