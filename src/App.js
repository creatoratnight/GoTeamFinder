import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Teamlist from "./Teamlist";
import firebase from "firebase";
import { db } from "./firebase";
import Room from "./Room";
import { makeStyles } from "@material-ui/core/styles";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 250,
    backgroundColor: "#363b81",
    borderRadius: "12px",
    border: "0px",
    padding: "0px 20px 20px 20px",
    outline: 0,
  },
  alert: {
    position: "absolute",
    width: 220,
    backgroundColor: "#363b81",
    borderRadius: "12px",
    border: "0px",
    padding: "0px 20px 20px 20px",
    outline: 0,
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [teams, setTeams] = useState([]);
  const [isInTeam, setIsInTeam] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerIsTeamleader, setPlayerIsTeamleader] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerTrainerId, setPlayerTrainerId] = useState("");
  const [playerLevel, setPlayerLevel] = useState("");
  const [encounterName, setEncounterName] = useState("");

  // Login anonymously and init
  useEffect(() => {
    firebase
      .auth()
      .signInAnonymously()
      .catch(function (error) {
        // Handle Errors here.
        //let errorCode = error.code;
        //let errorMessage = error.message;
        // ...
      });
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        //let isAnonymous = user.isAnonymous;
        let uid = user.uid;
        setUserId(uid);
        //console.log("userID: " + uid);
        setTeamId(user.photoURL);
        // ...
        if (user.photoURL) {
          setIsInTeam(true);
        }
      } else {
        console.log("User logged out");
      }
      // ...
    });
  }, []);

  // Set listener for whenever our firebase store changes
  useEffect(() => {
    db.collection("teams")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        // every time something changes in the database, this code gets fired
        setTeams(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            team: doc.data(),
          }))
        );
      });
  }, []);

  // Check the teams object everytime it changes to see if our team still exists
  useEffect(() => {
    if (teamId && teamId != "") {
      let docRef = db.collection("teams").doc(teamId);
      docRef
        .get()
        .then(function (doc) {
          if (!doc.exists) {
            setIsInTeam(false);
            setTeamId("");
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
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
  }, [teams]);

  return (
    <div className="app">
      <Header
        modalStyle={modalStyle}
        classes={classes}
        setIsInTeam={setIsInTeam}
        isInTeam={isInTeam}
        setTeamId={setTeamId}
        teamId={teamId}
        teams={teams}
        userId={userId}
        setPlayerId={setPlayerId}
        playerId={playerId}
        setPlayerIsTeamleader={setPlayerIsTeamleader}
        playerIsTeamleader={playerIsTeamleader}
        playerName={playerName}
        playerTrainerId={playerTrainerId}
        playerLevel={playerLevel}
        encounterName={encounterName}
        setPlayerName={setPlayerName}
        setPlayerTrainerId={setPlayerTrainerId}
        setPlayerLevel={setPlayerLevel}
        setEncounterName={setEncounterName}
      />
      {isInTeam ? (
        <Room
          modalStyle={modalStyle}
          classes={classes}
          teams={teams}
          teamId={teamId}
          setTeamId={setTeamId}
          userId={userId}
          playerId={playerId}
          setPlayerId={setPlayerId}
          playerIsTeamleader={playerIsTeamleader}
          setPlayerIsTeamleader={setPlayerIsTeamleader}
          playerName={playerName}
          setPlayerName={setPlayerName}
          setIsInTeam={setIsInTeam}
          setPlayerIsTeamleader={setPlayerIsTeamleader}
        />
      ) : (
        <Teamlist
          modalStyle={modalStyle}
          classes={classes}
          teams={teams}
          userId={userId}
          setIsInTeam={setIsInTeam}
          setTeamId={setTeamId}
          teamId={teamId}
          setPlayerIsTeamleader={setPlayerIsTeamleader}
          setPlayerId={setPlayerId}
          playerName={playerName}
          playerTrainerId={playerTrainerId}
          playerLevel={playerLevel}
          setPlayerName={setPlayerName}
          setPlayerTrainerId={setPlayerTrainerId}
          setPlayerLevel={setPlayerLevel}
        />
      )}
    </div>
  );
}

export default App;
