import { useEffect } from 'react';
import axios from 'axios';
import { useToasts } from "react-toast-notifications";

function useFetch({url, responseType="json",  data, unsetData, setData}) {
  const { addToast } = useToasts();

    // Input submitted event triggered
    useEffect(() => {
      async function handleFetch() {
        // Fetch if input has been successfully recieved
        if (data) {
          await axios({
              url: url,
              data: {'text': data},
              method: "post",
            })
              .then((res) => {
		console.log(res.data)
                unsetData(false)
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
  
export { useFetch }
