import React, { useEffect, useState } from "react";
import axios from "axios";
import PopUP from "../../componets/PopUp/PopUP";
import "./Home.css";
import { GrView, GrTrash, GrEdit, GrSearch } from "react-icons/gr";
import { Role } from "../../Role";

const key = true;
const limit = 5; //max recode per page

function Home() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  //fetch all data form api
  const loadData = async (e) => {
    const response = await axios.get(
      `http://localhost:5000/api/get?page=1&limit=` + limit
    );
    setPlayers(response.data.results);
    setTotalPage(response.data.totalPage);
  };

  //delete any particuler data using id
  const handleDelete = async (id) => {
    const response = await axios.delete(
      "http://localhost:5000/api/delete/" + id
    );
    const status = response.status;
    loadData();
    setTimeout(() => {
      status === 200
        ? alert("record Delete Successfully")
        : alert("error" + status);
    }, 100);
  };

  //search Team Name
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const searchValue = Object.values(search).join("").toUpperCase();
    console.log(searchValue);
    const url =
      `http://localhost:5000/api/get?playerTeam=` +
      searchValue +
      `&page=1&limit=` +
      limit;
    const response = await axios.get(url);
    setPlayers(response.data.results);
    setTotalPage(response.data.totalPage);
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearch({ ...search, value });
  };

  // const handleDropDown = async (e) => {
  //   const team = e.target.value;
  //   console.log(typeof team);
  //   console.log(team);
  //   if (team === "ALL") {
  //     const response = await axios.get("http://localhost:5000/api/get");
  //     setPlayers(response.data);
  //     console.log(true);
  //   } else {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/get?playerTeam=` + team
  //     );
  //     setPlayers(response.data);
  //     console.log(false);
  //   }
  // };

  //pagination
  const pagination = async (pageNumber) => {
    setPageNumber(pageNumber);
    console.log(pageNumber);
    if (Object.values(search).join("").length < 1) {
      const response = await axios.get(
        `http://localhost:5000/api/get?page=${pageNumber}&limit=${limit}`
      );
      setPlayers(response.data.results);
    } else {
      const response = await axios.get(
        `http://localhost:5000/api/get?playerTeam=${search.value}&page=${pageNumber}&limit=${limit}`
      );
      setPlayers(response.data.results);
    }
  };

  const handleRole = async (e) => {
    e.preventDefault();
    const role = e.target.value;
    console.log(role);
  };

  useEffect(() => {
    loadData();
  }, []);

  // players.playerStatus.indian === true && players.playerStatus.cap === true
  //   ? console.log("indian cap player")
  //   : players.playerStatus.indian === true &&
  //     players.playerStatus.uncap === true
  //   ? console.log("indian Uncap Player")
  //   : players.playerStatus.foreigner === true &&
  //     players.playerStatus.uncap === true
  //   ? console.log("Foreigner Uncap Player")
  //   : players.playerStatus.foreigner === true &&
  //     players.playerStatus.cap === true
  //   ? console.log("Foreigner cap Player")
  //   : console.log("enter proper data");
  return (
    <>
      <div className="divHead">
        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            id="search"
            type="text"
            className=" searchBar"
            placeholder="Search..."
            onChange={handleSearch}
          />
          <button type="submit" className="btn-search">
            <GrSearch />{" "}
          </button>
        </form>
        <PopUP />
        <div className="searchForm">
          <label className="ddLabel"> Choose a Team: </label>
          <select
            id="teams "
            name="playerTeam"
            className="dropdown"
            onClick={handleRole}
          >
            {Role.map((role, index) => {
              return (
                <option value={role.role} className="dropdownMenu">
                  {role.role}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {players.length === 0 || pageNumber < 1 ? (
        "Data is not available"
      ) : (
        <>
          <div>
            <table className="table">
              <thead className="thead">
                <tr>
                  <th className="tr">No</th>
                  <th className="tr">Player Name</th>
                  <th className="tr">Player Team</th>
                  <th className="tr">Role</th>
                  <th className="tr">PlayerStatus</th>
                  <th className="tr">Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  return (
                    //console.log(player.playerStatus);
                    <tr key={player.id} className="tr">
                      <th className="thead" scope="row">
                        {index + 1}
                      </th>
                      <td className="td">{player.playerName}</td>
                      <td className="td">{player.playerTeam}</td>
                      <td className="td">{player.role}</td>
                      <td className="td">
                        {player.playerStatus.indian === true &&
                        player.playerStatus.cap === true &&
                        player.playerStatus.foreigner === false &&
                        player.playerStatus.uncap === false
                          ? "Indian Cap Player"
                          : player.playerStatus.indian === true &&
                            player.playerStatus.uncap === true &&
                            player.playerStatus.foreigner === false &&
                            player.playerStatus.cap === false
                          ? "Indian Uncap Player"
                          : player.playerStatus.foreigner === true &&
                            player.playerStatus.uncap === true &&
                            player.playerStatus.indian === false &&
                            player.playerStatus.cap === false
                          ? "Foreigner Uncap Player"
                          : player.playerStatus.foreigner === true &&
                            player.playerStatus.cap === true &&
                            player.playerStatus.indian === false &&
                            player.playerStatus.uncap === false
                          ? "Foreigner Cap Player"
                          : "Enter proper data"}
                      </td>
                      <td className="tdAction">
                        <PopUP
                          id={player._id}
                          GrView={<GrView />}
                          buttonValue={key}
                        />
                        <button
                          className="btn-delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this information"
                              )
                            )
                              handleDelete(player._id);
                          }}
                        >
                          <GrTrash />
                        </button>
                        <PopUP id={player._id} GrEdit={<GrEdit />} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div>
        {
          <ul className="container">
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => pagination(pageNumber - 1)}
                href
              >
                Priv
              </a>
            </li>
            {Array.from(Array(totalPage), (e, i) => {
              return (
                <li key={i} className="page-item">
                  <a
                    className="page-link"
                    onClick={() => pagination(i + 1)}
                    href
                  >
                    {i + 1}{" "}
                  </a>
                </li>
              );
            })}
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => pagination(pageNumber + 1)}
                href
              >
                Next
              </a>
            </li>
          </ul>
        }
      </div>
    </>
  );
}
export default Home;
