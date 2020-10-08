import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
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

function TeamlistItem(props) {
  const [open, setOpen] = useState(false);
  const [trainerId, setTrainerId] = useState("");
  const [playerLevel, setPlayerLevel] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  //Make joinTeam function
  const joinTeam = (event) => {
    event.preventDefault();
    if (props.playerName === "") {
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
      let newPlayer = db
        .collection("teams")
        .doc(props.teamId)
        .collection("players")
        .doc();
      newPlayer.set({
        player_firebase_id: newPlayer.id,
        player_user_id: props.userId,
        player_is_teamleader: false,
        player_name: props.playerName,
        player_trainer_id: props.playerTrainerId,
        player_level: props.playerLevel,
        player_friend: false,
        player_ready: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setOpen(false);
      props.setIsInTeam(true);
      props.setTeamId(props.teamId);
      props.setPlayerIsTeamleader(false);
      props.setPlayerId(newPlayer.id);
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          user
            .updateProfile({
              photoURL: props.teamId,
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
      // Update players_amount in firebase
      changePlayersAmount(1);
    }
  };

  //This function is a duplicate of the same function in header!!!
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
    <div className="teamlist__item">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.paper}>
          <form>
            <h2 className="modal__h2">JOIN TEAM</h2>
            <div className="modal_inputContainer">
              <input
                className="modal__input"
                placeholder="PLAYER NAME"
                type="text"
                value={props.playerName}
                autoFocus
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
              <button className="modal__button" onClick={joinTeam}>
                JOIN
              </button>
              <button
                className="modal__button"
                type="Submit"
                onClick={() => setOpen(false)}
              >
                CANCEL
              </button>
            </div>
          </form>
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

      <div className="teamlist__tableRow">
        <div className="teamlist_tableColumnEncounter">
          <h4>{props.encounter_name}</h4>
        </div>
        <div className="teamlist_tableColumnPlayers">
          <h4>{props.players_amount}/6</h4>
        </div>
        <div className="teamlist_tableColumnJoin">
          <button
            className="teamlist__buttonJoin"
            onClick={() => setOpen(true)}
          >
            JOIN
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamlistItem;
