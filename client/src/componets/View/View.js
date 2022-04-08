import React ,{useEffect ,useState} from 'react';
import  axios  from 'axios';
import "./View.css"
function View({id}) {
  const [player,setPlayer]=useState("");

  useEffect(()=>{
    const loadData = async()=>{
      const url =`http://localhost:5000/api/get/`+id;
        const response = await axios.get(url); 
        console.log(response)
        console.log(response.data[0]);
        setPlayer(response.data[0]);    
    }
    loadData();
  },[id])
  return (
    <div>
         <h1 className="h1">Player Detail</h1>  
        <table className="cardTable">
          <tbody>
            <tr>
              <th>
                <strong>Player Name:</strong>
              </th>
              <td>
                <span>{player.playerName}</span>
              </td>
            </tr>
            <tr>
              <th>
                <strong>Team:</strong>
              </th>
              <td>
                <span>{player.playerTeam}</span>
              </td>
            </tr>
            <tr>
              <th>
                <strong>Player Role:</strong>
              </th>
              <td>
                <span>{player.role}</span>
              </td>
            </tr>
          </tbody>        
        </table>
    </div>
  )
}

export default View