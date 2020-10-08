import React, { useState } from "react";
import "./Header.css";
import Modal from "@material-ui/core/Modal";
import Help from "./Help";
import firebase from "firebase";
import { db } from "./firebase";

function handleTrainerCode(e) {
  let value = e.target.value;
  value = value.replace(/[A-Za-z]/g, "");
  value = value.slice(0, 14);
  if (value.length === 5) {
    value = value.slice(0, 4) + " " + value.slice(4, 5);
  }
  if (value.length === 10) {
    value = value.slice(0, 9) + " " + value.slice(9, 10);
  }
  if (/\s+$/.test(value)) {
    value = value.slice(0, value.length - 2);
  }
  return value;
}

function handleLevel(e) {
  let value = e.target.value;
  value = value.replace(/[A-Za-z]/g, "");
  value = Math.min(value.slice(0, 2), 40).toString();
  if (value === "0") {
    value = "";
  }
  return value;
}

function Header(props) {
  const [open, setOpen] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const createTeam = (event) => {
    event.preventDefault();
    if (props.encounterName === "") {
      // No encounterName
      setOpenAlert(true);
      setAlertText("PLEASE FILL IN A ENCOUNTER NAME");
    } else if (props.playerName === "") {
      // No playerName
      setOpenAlert(true);
      setAlertText("PLEASE FILL IN YOUR PLAYER NAME");
    } else if (props.playerTrainerId.length < 14) {
      // trainerId not valid
      setOpenAlert(true);
      setAlertText("THIS IS NOT A VALID TRAINER CODE");
    } else if (props.playerLevel === "") {
      // No playerLevel
      setOpenAlert(true);
      setAlertText("PLEASE FILL IN YOUR LEVEL");
    } else {
      event.preventDefault();
      // Post into firebase
      let newDoc = db.collection("teams").doc();
      newDoc.set({
        encounter_name: props.encounterName,
        id: 0,
        players_amount: 1,
        public: true,
        room_full: false,
        room_started: false,
        ready_check: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      let newPlayer = db
        .collection("teams")
        .doc(newDoc.id)
        .collection("players")
        .doc();
      newPlayer.set({
        player_firebase_id: newPlayer.id,
        player_user_id: props.userId,
        player_is_teamleader: true,
        player_name: props.playerName,
        player_trainer_id: props.playerTrainerId,
        player_level: props.playerLevel,
        player_friend: false,
        player_ready: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setOpen(false);
      props.setIsInTeam(true);
      props.setTeamId(newDoc.id);
      props.setPlayerIsTeamleader(true);
      props.setPlayerId(newPlayer.id);
      //console.log("created new team with id: " + newDoc.id);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          user
            .updateProfile({
              photoURL: newDoc.id,
            })
            .catch(function (error) {
              // An error happened.
            });
          // ...
        } else {
          console.log("User logged out");
        }
        // ...
      });
    }
  };

  const leaveTeam = (event) => {
    event.preventDefault();
    // Post into firebase
    if (props.playerIsTeamleader) {
      db.collection("teams")
        .doc(props.teamId)
        .delete()
        // .then(function () {
        //   console.log("Document successfully deleted!");
        // })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    } else {
      db.collection("teams")
        .doc(props.teamId)
        .collection("players")
        .doc(props.playerId)
        .delete()
        // .then(function () {
        //   console.log("Document successfully deleted!");
        // })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      changePlayersAmount(-1);
    }
    props.setIsInTeam(false);
    props.setTeamId("");
    props.setPlayerIsTeamleader(false);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        user
          .updateProfile({
            photoURL: "",
          })
          .catch(function (error) {
            // An error happened.
          });
        // ...
      } else {
        console.log("User logged out");
      }
      // ...
    });
  };

  //This function is a duplicate of the same function in teamlistitem!!!
  function changePlayersAmount(amount) {
    props.teams.map(({ id, team }) => {
      let doc = db.collection("teams").doc(props.teamId);
      // If players amount is 4 (5 after this player joins), remove team from list
      if (team.players_amount === 5 && amount > 0) {
        doc.set({
          encounter_name: team.encounter_name,
          id: team.id,
          players_amount: team.players_amount + amount,
          public: team.public,
          room_full: true,
          room_started: team.room_started,
          timestamp: team.timestamp,
        });
      } else {
        doc.set({
          encounter_name: team.encounter_name,
          id: team.id,
          players_amount: team.players_amount + amount,
          public: team.public,
          room_full: false,
          room_started: team.room_started,
          timestamp: team.timestamp,
        });
      }
    });
  }

  return (
    <div className="header">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.paper}>
          <form>
            <h2 className="modal__h2">CREATE TEAM</h2>
            <div className="modal_inputContainer">
              <input
                className="modal__input"
                placeholder="ENCOUNTER NAME"
                type="text"
                value={props.encounterName}
                autoFocus
                onChange={(e) =>
                  props.setEncounterName(
                    e.target.value.toUpperCase().slice(0, 20)
                  )
                }
              />
            </div>
            {/* <div className="modal__checkboxContainer">
              PRIVATE ROOM
              <input type="checkbox" className="modal__checkbox" />
              <span class="checkmark"></span>
            </div> */}
            <br />
            <div className="modal_inputContainer">
              <input
                className="modal__input"
                placeholder="PLAYER NAME"
                type="text"
                value={props.playerName}
                onChange={(e) =>
                  props.setPlayerName(e.target.value.toUpperCase().slice(0, 15))
                }
              />
            </div>
            <div className="modal_inputContainer">
              <input
                className="modal__input"
                placeholder="TRAINER CODE"
                type="text"
                value={props.playerTrainerId}
                onChange={(e) => props.setPlayerTrainerId(handleTrainerCode(e))}
              />
            </div>
            <div className="modal_inputContainer">
              <input
                className="modal__input"
                placeholder="LEVEL (1-40)"
                type="text"
                value={props.playerLevel}
                onChange={(e) => props.setPlayerLevel(handleLevel(e))}
              />
            </div>
            <br />
            <div className="modal__buttonContainer">
              <button className="modal__button" onClick={createTeam}>
                CREATE
              </button>
              <button className="modal__button" onClick={() => setOpen(false)}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={openHelp}
        onClose={() => setOpenHelp(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.paper}>
          <h2 className="modal__h2">HELP</h2>
          <div className="modal__helpinner">
            <Help />
          </div>
          <br />
          <div className="modal__buttonContainer">
            <button
              className="modal__button"
              onClick={() => setOpenHelp(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.alert}>
          <div className="modal__alert">
            <h2 className="modal__alerth2">{alertText}</h2>
            <button
              className="modal__alertButton"
              onClick={() => setOpenAlert(false)}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <div className="header__container">
        <div className="header__left">
          <button
            className="header__buttonHelp"
            onClick={() => setOpenHelp(true)}
          >
            ?
          </button>
        </div>
        <div className="header__center">
          <img
            className="header__logo"
            src={require("./goteamfinder_logo_1024.png")}
            alt="GoTeamFinder"
          />
        </div>
        <div className="header__right">
          {props.isInTeam ? (
            <button className="header__buttonLeave" onClick={leaveTeam}>
              LEAVE TEAM
            </button>
          ) : (
            <button
              className="header__buttonCreate"
              onClick={() => setOpen(true)}
            >
              CREATE TEAM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
