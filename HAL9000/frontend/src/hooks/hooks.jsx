import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToasts } from "react-toast-notifications";

function useFetch({url, responseType="json",  data, unsetData, setData}) {
  const { addToast } = useToasts();

    // Input submitted event triggered
    useEffect(() => {
      async function handleFetch() {
        // Fetch if input has been successfully recieved
        if (data) {
            console.log(url)
          await axios({
              url: url,
              data: {'text': 'What is your name?'},
              headers : { //
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' //
                }, //
              method: "post",
            })
              .then((res) => {
                setData("data:audio/wav;base64," + res.data) 
              })
              .catch((error) => {
                addToast("Oops! Something Went Wrong", {
                    appearance: "error",
                    autoDismiss: true,
                    });
                setData(null);
                    console.log("axios error:", error);
              });
        } 
      }

      handleFetch()
    }, [data])
    
    return data
  };

  function useInput({ type /*...*/ }) {
    const [value, setValue] = useState("");
    const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />;
    return [value, input];
  }
  
export { useFetch, useInput }
