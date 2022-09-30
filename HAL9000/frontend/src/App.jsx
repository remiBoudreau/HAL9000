// React Hooks
import { useState } from "react";
// Custom Hooks
import { useFetch } from "./hooks/hooks"
// Components
import HAL9000 from "./components/HAL9000/HAL9000"
import Footer from "./components/Footer/Footer";

// STYLING
// Material UI
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
// Nodejs library that concatenates classes
import classNames from "classnames";
// Styles
import styles from "./styles.js"
const useStyles = makeStyles((theme) => styles(theme));

// Prevent refresh on "enter"
const preventDefault = (f) => (e) => {
  e.preventDefault();
  f(e);
};

const App = () => {
  const [speech, setSpeech] = useState(false)
  const [text, setText] = useState(false)
  const [src, setSrc] = useState(false)
  
  const classes = useStyles();
  const handleSubmit = preventDefault((event) => {
    setText(event.target[event.target.length - 1].value)
  }, []);
  
  // useFetch({
  //   url: "https://api.publicapis.org/entries",
  //   responseType: "blob",
  //   data: speech,
  //   unsetData: setSpeech,
  //   setData: setSrc,
  // })

  useFetch({
    url: process.env.CONVERSE_API,
    data: text,
    unsetData: setText,
    setData: setSrc,
  })

  return (
    <>
    <div className={
      classNames(
         classes.bg
       )
 }>
    <div
      className={
           classNames(
              classes.formContainer,
              classes.resizeIn,
              classes.formMaxHeight
            )
      }
    >
      <div
        className={classNames(
          classes.boxToggle,
        )}
      />
        <form
          className={classNames(
            classes.desktopForm
          )}
          onSubmit={handleSubmit}
        >
          <div
            className={classNames(classes.textFieldWrapper)}
          >
            <TextField
              label="Say something...?"
              variant="filled"
              className={
                  classNames(classes.root, classes.animatedForm)
              }
              defaultValue=""
              style={{ width: "100%" }}
            />
          </div>
        </form>
    </div>
    </div>
    <audio autoPlay={true} id="audio" controls src={src ? src : null} />
    <Footer/>
    </>
  );
};

export default App;
