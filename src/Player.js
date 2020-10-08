import React, { useState } from "react";
import "./Player.css";
import { db } from "./firebase";
import Modal from "@material-ui/core/Modal";

function Player(props) {
  const [showKick, setShowKick] = useState(false);

  function changePlayerFriend(newState) {
    let doc = db
      .collection("teams")
      .doc(props.teamId)
      .collection("players")
      .doc(props.playerFirebaseId);
    doc.set({
      player_firebase_id: props.playerFirebaseId,
      player_friend: newState,
      player_is_teamleader: props.playerIsTeamleader,
      player_level: props.playerLevel,
      player_name: props.playerName,
      player_ready: props.playerReady,
      player_trainer_id: props.playerTrainerId,
      player_user_id: props.userId,
      timestamp: props.timestamp,
    });
  }

  function readyCheck() {
    props.isReady(props.playerFirebaseId);
    let doc = db.collection("teams").doc(props.teamId);
    doc.update({
      ready_check: true,
    });
  }

  function kickPlayer(playerId) {
    db.collection("teams")
      .doc(props.teamId)
      .collection("players")
      .doc(playerId)
      .delete()
      // .then(function () {
      //   console.log("Document successfully deleted!");
      // })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
    changePlayersAmount(-1);
  }

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

  const renderButton = () => {
    if (props.playerIsTeamleader) {
      // Room owner
      if (props.playerId === props.userId) {
        // This player
        if (props.playerFriend) {
          // All friend requests are sent
          if (props.allFriends && !props.allReady) {
            return (
              <div className="player__buttonContainer">
                <button
                  className="player__buttonReadyCheck"
                  onClick={() => readyCheck()}
                >
                  READY CHECK
                </button>
                <button
                  className="player__buttonSent"
                  onClick={() => changePlayerFriend(false)}
                >
                  ALL FRIEND
                  <br />
                  REQUESTS SENT
                </button>
              </div>
            );
          } else {
            return (
              <button
                className="player__buttonSent"
                onClick={() => changePlayerFriend(false)}
              >
                ALL FRIEND
                <br />
                REQUESTS SENT
              </button>
            );
          }
        } else {
          // Not all friend requests sent
          return (
            <button
              className="player__buttonSending"
              onClick={() => changePlayerFriend(true)}
            >
              ALL FRIEND
              <br />
              REQUESTS SENT
            </button>
          );
        }
      } else {
        // Other player
        if (props.playerFriend) {
          // All friend requests are sent
          return (
            <button className="player__buttonSent">
              ALL FRIEND
              <br />
              REQUESTS SENT
            </button>
          );
        } else {
          // Not all friend requests sent
          return (
            <button className="player__buttonSending">
              SENDING OUT
              <br />
              FRIEND REQUESTS
            </button>
          );
        }
      }
    } else {
      // Players
      if (props.playerId === props.userId) {
        // This player
        if (props.playerFriend) {
          // Is friend
          return (
            <button
              className="player__buttonAcceptedTrue"
              onClick={() => changePlayerFriend(false)}
            >
              FRIEND REQUEST
              <br />
              ACCEPTED
            </button>
          );
        } else {
          // Is not friend
          return (
            <button
              className="player__buttonAcceptedFalse"
              onClick={() => changePlayerFriend(true)}
            >
              FRIEND REQUEST
              <br />
              ACCEPTED
            </button>
          );
        }
      } else {
        // Other player
        if (props.thisIsLeader) {
          if (showKick) {
            return (
              <button
                className="player__buttonKick"
                onClick={() => kickPlayer(props.playerFirebaseId)}
              >
                KICK
              </button>
            );
          } else {
            if (props.playerFriend) {
              // Is friend
              return (
                <button className="player__buttonAcceptedTrue">
                  FRIEND REQUEST
                  <br />
                  ACCEPTED
                </button>
              );
            } else {
              // Is not friend
              return (
                <button className="player__buttonAcceptedFalse">
                  FRIEND REQUEST
                  <br />
                  ACCEPTED
                </button>
              );
            }
          }
        } else {
          if (props.playerFriend) {
            // Is friend
            return (
              <button className="player__buttonAcceptedTrue">
                FRIEND REQUEST
                <br />
                ACCEPTED
              </button>
            );
          } else {
            // Is not friend
            return (
              <button className="player__buttonAcceptedFalse">
                FRIEND REQUEST
                <br />
                ACCEPTED
              </button>
            );
          }
        }
      }
    }
  };
  return (
    <div
      onMouseOver={() => {
        setShowKick(true);
      }}
      onMouseOut={() => {
        setShowKick(false);
      }}
      className={props.playerId === props.userId ? "player__self" : "player"}
    >
      <div className="player__level">{props.playerLevel}</div>
      <div className="player__name">
        <h3>{props.playerName}</h3>
        <h4>{props.playerTrainerId}</h4>
      </div>
      {renderButton()}

      {props.userId === props.playerId ? (
        <Modal
          open={props.openReadyCheck}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={props.modalStyle} className={props.classes.paper}>
            <div className="modal__alert">
              <h1 className="modal__clock">{props.seconds}</h1>
              {props.playerIsTeamleader ? (
                <div>
                  <h2 className="modal__alerth2">
                    CHECKING IF ALL PLAYERS ARE READY
                  </h2>
                </div>
              ) : (
                <div>
                  {!props.readyStateSet ? (
                    <div>
                      <h2 className="modal__alerth2">ARE YOU READY?</h2>
                      <button
                        className="modal__button"
                        onClick={() => props.isReady(props.playerFirebaseId)}
                      >
                        YES
                      </button>
                    </div>
                  ) : (
                    <h2 className="modal__alerth2">
                      WAITING FOR OTHER PLAYERS
                    </h2>
                  )}
                </div>
              )}
            </div>
          </div>
        </Modal>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Player;
