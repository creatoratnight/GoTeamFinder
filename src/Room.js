import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import Player from "./Player";
import "./Room.css";
import firebase from "firebase";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";

function Room(props) {
  const [players, setPlayers] = useState([]);
  const [seconds, setSeconds] = useState(10);
  const [allFriends, setAllFriends] = useState(false);
  const [allReady, setAllReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [openReadyCheck, setOpenReadyCheck] = useState(false);
  const [openReadyToStart, setOpenReadyToStart] = useState(false);
  const [openNotReadyToStart, setOpenNotReadyToStart] = useState(false);
  const [readyStateSet, setReadyStateSet] = useState(false);

  function toggleTimer() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setSeconds(10);
    setIsActive(false);
  }

  function isReady(playerId) {
    setReadyStateSet(true);
    db.collection("teams")
      .doc(props.teamId)
      .collection("players")
      .doc(playerId)
      .update({
        player_ready: true,
      });
  }

  function readyCheckEnd() {
    resetTimer();
    let doc = db.collection("teams").doc(props.teamId);
    doc.update({
      ready_check: false,
    });
    if (allReady) {
      setOpenReadyToStart(true);
      setAllReady(true);
    } else {
      setOpenNotReadyToStart(true);
      players.map((player) => {
        db.collection("teams")
          .doc(props.teamId)
          .collection("players")
          .doc(player.player_firebase_id)
          .update({
            player_ready: false,
          });
      });
    }
    setReadyStateSet(false);
  }

  function checkIfPlayersAreReady() {
    if (players.length > 0) {
      let checkAllReady = true;
      players.map((player) => {
        if (!player.player_ready) {
          checkAllReady = false;
        }
      });
      if (checkAllReady) {
        setAllReady(true);
      }
    }
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (seconds === 0) {
        setOpenReadyCheck(false);
        readyCheckEnd();
      }
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    let unsubscribe;
    if (props.teamId) {
      unsubscribe = db
        .collection("teams")
        .doc(props.teamId)
        .collection("players")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setPlayers(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [props.teamId]);

  useEffect(() => {
    let checkFriends = true;
    let areWeInTeam = false;
    if (props.playerId === "") {
      if (players.length > 0) {
        players.map((player) => {
          if (player.player_user_id === props.userId) {
            props.setPlayerId(player.player_firebase_id);
            props.setPlayerName(player.player_name);
            if (player.player_is_teamleader) {
              props.setPlayerIsTeamleader(true);
            }
          }
        });
      }
    }
    players.map((player) => {
      if (!player.player_friend) {
        checkFriends = false;
      }
      if (player.player_user_id === props.userId) {
        areWeInTeam = true;
      }
    });
    setAllFriends(checkFriends);
    checkIfPlayersAreReady();
    if (players.length > 0) {
      if (!areWeInTeam) {
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
      }
    }
  }, [players]);

  useEffect(() => {
    props.teams.map(({ id, team }) => {
      if (id === props.teamId) {
        if (team.ready_check) {
          setOpenReadyCheck(true);
          toggleTimer();
        }
      }
    });
  }, [props.teams]);

  return (
    <div className="room">
      {players.map((player) => (
        <Player
          modalStyle={props.modalStyle}
          classes={props.classes}
          key={player.player_user_id}
          teamId={props.teamId}
          players={players}
          playerName={player.player_name}
          playerTrainerId={player.player_trainer_id}
          playerLevel={player.player_level}
          playerFriend={player.player_friend}
          playerReady={player.player_ready}
          playerIsTeamleader={player.player_is_teamleader}
          playerId={player.player_user_id}
          playerFirebaseId={player.player_firebase_id}
          userId={props.userId}
          timestamp={player.timestamp}
          allFriends={allFriends}
          allReady={allReady}
          seconds={seconds}
          setOpenReadyToStart={setOpenReadyToStart}
          setOpenNotReadyToStart={setOpenNotReadyToStart}
          setOpenReadyCheck={setOpenReadyCheck}
          openReadyCheck={openReadyCheck}
          isReady={isReady}
          readyStateSet={readyStateSet}
          thisIsLeader={props.playerIsTeamleader}
          teams={props.teams}
        />
      ))}

      <Chat teamId={props.teamId} playerName={props.playerName} />

      <Modal
        open={openReadyToStart}
        onClose={() => setOpenReadyToStart(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.paper}>
          <div className="modal__alert">
            <h1 className="modal__clock">{props.seconds}</h1>
            <div>
              <h2 className="modal__alerth2">READY TO START ENCOUNTER</h2>
              <button
                className="modal__button"
                onClick={() => setOpenReadyToStart(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={openNotReadyToStart}
        onClose={() => setOpenNotReadyToStart(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={props.modalStyle} className={props.classes.paper}>
          <div className="modal__alert">
            <h1 className="modal__clock">{props.seconds}</h1>
            <div>
              <h2 className="modal__alerth2">NOT ALL PLAYERS WERE READY</h2>
              <button
                className="modal__button"
                onClick={() => setOpenNotReadyToStart(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Room;
