import axios from "axios";
import React, { useState, useEffect } from "react";
import { checkBox, ipl2022, Role } from "../../Role";
import "./AddEdit.css";
const defaultValue = {
  playerName: "",
  playerTeam: "",
  role: "",
  playerStatus: {
    uncap: false,
    cap: false,
    indian: false,
    foreigner: false,
  },
};

function AddEdit({ id, setPopUp, popUp }) {
  const [player, setPlayer] = useState(defaultValue);
  const [checkBox1] = useState(checkBox);

  const handleChange = (e) => {
    const target = e.target;
    const name = target.name;
    const type = target.type;
    const value = type === "checkbox" ? target.checked : target.value;
    type === "checkbox"
      ? setPlayer({
          ...player,
          playerStatus: { ...player.playerStatus, [name]: value },
        })
      : setPlayer({ ...player, [name]: value });
  };
  console.log(player);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      //add new recode
      const response = await axios.post(
        "http://localhost:5000/api/post",
        player
      );
      const status = await response.status;
      setPlayer(defaultValue);
      setPopUp(!popUp);
      status === 200
        ? alert("player successfully added")
        : alert("error" + status);
    } else {
      //update recode
      const response = await axios.patch(
        "http://localhost:5000/api/update/" + id,
        player
      );
      const status = await response.status;
      setPlayer(defaultValue);
      setPopUp(!popUp);
      status === 200
        ? alert("player successfully Update")
        : alert("error" + status);
    }
  };
  const handleRest = () => {
    //reset form
    setPlayer(defaultValue);
  };
  //get data by id for fill input filed
  const loadData = async () => {
    const url = `http://localhost:5000/api/get/` + id;
    const response = await axios.get(url);
    setPlayer(response.data[0]);
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Player Name : </label>
        <input
          type="text"
          name="playerName"
          className="input"
          value={player.playerName}
          placeholder="enter player name here..."
          onChange={handleChange}
          required
        />
        <br />
        <label>Player Team : </label>
        <br />
        <select
          id="teams "
          name="playerTeam"
          onChange={handleChange}
          className="ddTeam"
          value={player.playerTeam}
        >
          <option value="" defaultValue="true" disabled hidden>
            select Player's Team
          </option>
          {ipl2022.map((team, index) => {
            return (
              <option value={team.teamName} name="playerTeam">
                {team.teamName}
              </option>
            );
          })}
        </select>
        <br />
        <label>Player Role : </label>

        <div>
          {Role.map((role, index) => {
            return (
              <div className="radioDiv">
                <input
                  key={role.id}
                  type="radio"
                  id={role.role}
                  name="role"
                  value={role.role}
                  checked={player.role === role.role}
                  onChange={handleChange}
                />
                <label>{role.role}</label>
              </div>
            );
          })}
        </div>
        <label>I am Currenty</label>
        <div>
          {checkBox1.map((status, index) => (
            <div className="radioDiv">
              <input
                type="checkbox"
                value={status.playerStatus}
                name={status.playerStatus}
                onChange={handleChange}
                //defaultChecked={false}
                checked={player.playerStatus[checkBox[index].playerStatus]}
              />
              <label>{status.playerStatus}</label>{" "}
            </div>
          ))}
        </div>
        <br />
        <hr />
        <div className="btn-div">
          <button className="btn-submit">{id ? "update" : "Submit"}</button>
          <button className="btn-reset" onClick={handleRest}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEdit;
