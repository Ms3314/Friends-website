import { useState, useEffect } from "react";
import axios from "axios";


const server =  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';


function Match({ form }) {
  const [similiar, setSimiliar] = useState([]);
  const email = form.email;
  const handleRefresh = () => {
    if (email) {
      axios.get(`${server}/api/users/${email}`)
        .then((response) => {
          console.log(response.data)
          console.log("this is the matches , " , response.data.matches);
          setSimiliar(response.data.matches);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  useEffect(() => {
    // Ensure email is available before making the request
    handleRefresh()
  }, []); //

  
  

  return (
    <div className=" flex gap-5 flex-col items-center h-screen">
      <button className="mt-5 border-2 border-slate-600 text-sm font-bold  bg-blue-300 p-3 rounded-full text-slate-600" onClick={handleRefresh}>Refresh (lonely button)</button>
      <h1 className="text-3xl font-bold text-center ">Your New Friends 🪽👋</h1>
      {similiar.map((data, key) => (
        <>
        {
          data.score > 3 &&
          <Card  data={data} key={key} />
        }
        </>
      ))}
      <br />
      <hr />
    </div>
  );
}

const Card = ({ data }) => {
  let {user:{name} , score , match} = data
  return (
    <div className="bg-green-300 rounded  w-[270px] p-4">
      <p>Name: {name}</p>  
      <p>Similiar choices :</p>
      <div className="mt-2 flex gap-3 flex-wrap ">
      {
        match.map((data , index)=>(
          data && <button key={index} className="px-4 py-1  rounded-full  bg-white">{data}</button>
        ))
      } 
      </div>
      {/* <div className="mt-2 flex gap-3 flex-wrap ">
      {
        choice.map((sa)=> {
          <p>Choice : {}</p>
        })
      
      }
      </div> */}

    </div>
  );
};

export default Match;
