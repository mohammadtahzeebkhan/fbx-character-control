import { useState,useEffect } from "react";
import { Html } from "@react-three/drei";
const Question=()=>{

const [apiData, setApiData] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Fetch data from the initial API
  fetch('https://bermudaunicorn.com/api/beuapi.php?type=fetchquestion&que=Which-city-is-known-as-the-Pink-City')
    .then(response => response.json())
    .then(data => {
        console.log("data",data)
      setApiData(data);
      setIsLoading(false);
    })
    .catch(error => {
      
      setApiData(["Error While Fetcing Data"])
      console.error( error)
    
    
    });
}, []);

const fetchNextApiData = () => {
  setIsLoading(true);
  // Fetch data from the next API endpoint
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
      setApiData(data);
      setIsLoading(false);
    })
    .catch(error => {apiData
      console.error('Error fetching next data:', error);
      setIsLoading(false);
    });
};


function ApiDataDisplay1( ) {
    return (
      <Html position={[0, 0, 0]} transform>
        <button onClick={()=>{setModalFun()}}>
          Click Next
        </button>
        <input />
      </Html>
    );
  }

  function ApiDataDisplay({ data, isLoading }) {
    return (
      <Html position={[0, 0, 0]} transform>
        {!isLoading ? (
          <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
        ) : (
          <div  /* onClick={(e)=>{localStorage.setItem("modal",true)}} */  style={{ maxHeight: '134px',width:"247px", overflowY: 'auto', color: 'white' }}>
           <p>{apiData}</p>
          </div>
        )}
      </Html>
    );
  }

return(<>


<ApiDataDisplay data={apiData} isLoading={isLoading}/>
{/* <ApiDataDisplay1/>   */}




</>)





}


export default Question;




  


