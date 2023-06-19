function CanReplyPopup({ isEveryOneCanReply, onClick }) {
  return (
    <div className="can-reply-popup">
      <div className="head">
        <div className="title">Who can reply?</div>
        <span>Choose who can reply to this Tweet.</span>
      </div>

      <div className="options">
        <div
          className={"option " + (isEveryOneCanReply ? "active" : "")}
          onClick={() => onClick(true)}
        >
          <i className="bi bi-globe-americas">Everyone</i>
        </div>

        <div
          className={"option " + (!isEveryOneCanReply ? "active" : "")}
          onClick={() => onClick(false)}
        >
          <i className="bi bi-people-fill">People you follow</i>
        </div>
      </div>
    </div>
  );
}

export default CanReplyPopup;
