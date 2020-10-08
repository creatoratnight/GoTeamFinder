import React from "react";

function Help() {
  return (
    <div className="modal__help">
      <h2 className="help__title">CREATING A TEAM</h2>
      <div className="help__text">
        <strong>1.</strong> Click the "CREATE TEAM" button on the top right and
        fill in the fields. Click "CREATE" to create the new team.
      </div>
      <div className="help__text">
        <strong>2.</strong> Wait for people to join your team and send them a
        friend request in the game.
      </div>
      <div className="help__text">
        <strong>3.</strong> When you've sent all players a friend request, click
        the "ALL FRIEND REQUESTS SENT" button to let other players know they
        should have a friend request.
      </div>
      <div className="help__text">
        <strong>4.</strong> When all players have accepted their friend request,
        you will get a "READY CHECK" button. Click this button to check if all
        players are ready to play.
      </div>
      <div className="help__text">
        <strong>5.</strong> When all players are ready you will get a "READY TO
        START ENCOUNTER" message. You can now start the encounter in the game.
        If not all players are ready you can click the "READY CHECK" button to
        try again.
      </div>
      <div className="help__text">
        <strong>6.</strong> If a player is idle or misbehaves in chat you can
        kick them by hovering over their name and click the "KICK" button on the
        right.
      </div>
      <h2 className="help__title">JOINING A TEAM</h2>
      <div className="help__text">
        <strong>1.</strong> Look for the encounter you want to do and click the
        "JOIN" button on the right side.
      </div>
      <div className="help__text">
        <strong>2.</strong> Once you enter the team, the team leader will send
        you a friend request in the game.
      </div>
      <div className="help__text">
        <strong>3.</strong> When you accepted the friend request, click the
        "FRIEND REQUEST ACCEPTED" button on the right side of your name. Note
        that if you are allready friends with the team leader, you won't get a
        new friend request.
      </div>
      <div className="help__text">
        <strong>4.</strong> When all players have accepted their friend request,
        the team leader will do a "ready check". Click the "YES" button in the
        message to let them know you are ready.
      </div>
      <div className="help__text">
        <strong>5.</strong> When all players are ready you will get a "READY TO
        START ENCOUNTER" message. The team leader will now start the encounter
        in the game.
      </div>
    </div>
  );
}

export default Help;
