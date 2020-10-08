import React from "react";
import TeamlistItem from "./TeamlistItem";
import "./Teamlist.css";

function Teamlist(props) {
  return (
    <div className="teamlist">
      <h2>JOIN A TEAM</h2>
      <div className="teamlist__container">
        <div className="teamlist__tableRow">
          <div className="teamlist_tableColumnEncounter">
            <h3>ENCOUNTER</h3>
          </div>
          <div className="teamlist_tableColumnPlayers">
            <h3>PLAYERS</h3>
          </div>
          <div className="teamlist_tableColumnJoin"></div>
        </div>

        {props.teams.map(({ id, team }) => {
          if (!team.room_full) {
            return (
              <TeamlistItem
                key={id}
                teams={props.teams}
                teamId={id}
                userId={props.userId}
                players_amount={team.players_amount}
                encounter_name={team.encounter_name}
                public={team.public}
                room_full={team.room_full}
                room_started={team.room_started}
                timestamp={team.timestamp}
                modalStyle={props.modalStyle}
                classes={props.classes}
                setIsInTeam={props.setIsInTeam}
                setTeamId={props.setTeamId}
                setPlayerIsTeamleader={props.setPlayerIsTeamleader}
                setPlayerId={props.setPlayerId}
                playerName={props.playerName}
                playerTrainerId={props.playerTrainerId}
                playerLevel={props.playerLevel}
                setPlayerName={props.setPlayerName}
                setPlayerTrainerId={props.setPlayerTrainerId}
                setPlayerLevel={props.setPlayerLevel}
              />
            );
          }
        })}

        {/* <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} />
        <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} />
        <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} />
        <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} />
        <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} />
        <TeamlistItem modalStyle={props.modalStyle} classes={props.classes} /> */}
      </div>
    </div>
  );
}

export default Teamlist;
