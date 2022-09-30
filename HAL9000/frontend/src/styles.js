const resizeTime = 1000;
const animatedFormTime = 2000;
const movieSuggestionsHeight = 50;
const styles = (theme) => {
  return {
    root: {
      "& .MuiFilledInput-root": {
        background: "white",
        borderRadius: "50px 50px 50px 50px",
      },
      "& .MuiFilledInput-underline:before": {
        borderBottom: "0",
      },
      "& .MuiFilledInput-underline:after": {
        borderBottom: "0",
      },
      "& .MuiFormHelperText-root": {
        color: "red",
        fontSize: "2vh",
      },
      "& .MuiFormLabel-root": {
        paddingLeft: "82px",
        paddingRight: "22px",
      },
      "& .MuiInputBase-input": {
        paddingLeft: "74px",
      },
    },
    textFieldWrapper: {
      position: "absolute",
      width: "50vw",
      overflow: "hidden",
      animation: `$animatedForm ${animatedFormTime}ms`,
    },
    "@keyframes animatedForm": {
      "0%": {
        width: "56px",
        left: "calc(75vw - 56px)",
      },
      "50%": {
        width: "56px",
        left: "calc(75vw - 56px)",
      },
      "100%": {
        width: "50vw",
        left: "25vw",
      },
    },
    textFieldInput: {
      paddingLeft: "74px",
    },
    mobileForm: {
      position: "absolute",
      top: "3%",
      left: "3%",
      width: "80%",
      "& .MuiInputBase-root": {
        fontSize: "3rem",
      },
      "& .MuiFormLabel-root": {
        fontSize: "2.2rem",
      },
    },
    desktopForm: {
      width: "50vw",
      "& .MuiInputBase-root": {
        height: "56px",
        fontSize: "1.75rem",
      },
    },
    resizeIn: {
      animation: `$resizeIn ${resizeTime}ms ${theme.transitions.easing.easeInOut}`,
    },
    "@keyframes resizeIn": {
      "0%": {
        height: "100vh",
      },
      "100%": {
        height: `${100 - movieSuggestionsHeight}vh`,
      },
    },
    resizeOut: {
      animation: `$resizeOut ${resizeTime}ms ${theme.transitions.easing.easeInOut}`,
    },
    "@keyframes resizeOut": {
      "0%": {
        height: `${100 - movieSuggestionsHeight}vh`,
      },
      "100%": {
        height: "100vh",
      },
    },
    formContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
    },
    formMaxHeight: {
      height: `${100 - movieSuggestionsHeight}vh`,
    },
    boxToggle: {
      height: "100%",
      width: "100%",
      position: "absolute",
    },
    bg: {
      height: "100vh",
      width: "100vw",
      backgroundColor: "black"
    },
  };
};

export default styles;