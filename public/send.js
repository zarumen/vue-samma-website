window.onload = function(e) {
  // init で初期化。基本情報を取得。
  // https://developers.line.me/ja/reference/liff/#initialize-liff-app
  window.liff.init(function(data) {
    getProfile();
    // initializeApp(data);
  });
};

// プロファイルの取得と表示
function getProfile() {
  // https://developers.line.me/ja/reference/liff/#liffgetprofile()
  liff
    .getProfile()
    .then(function(profile) {
      document.getElementById("useridprofilefield").textContent =
        profile.userId;
      document.getElementById("displaynamefield").textContent =
        profile.displayName;

      var profilePictureDiv = document.getElementById("profilepicturediv");
      if (profilePictureDiv.firstElementChild) {
        profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
      }
      var img = document.createElement("img");
      img.src = profile.pictureUrl;
      img.alt = "Profile Picture";
      img.width = 200;
      profilePictureDiv.appendChild(img);

      document.getElementById("statusmessagefield").textContent =
        profile.statusMessage;
    })
    .catch(function(error) {
      window.alert("Error getting profile: " + error);
    });
}

// function initializeApp(data) {
//   // document.getElementById("languagefield").textContent = data.language;
//   // document.getElementById("viewtypefield").textContent = data.context.viewType;
//   // document.getElementById("useridfield").textContent = data.context.userId;
//   // document.getElementById("utouidfield").textContent = data.context.utouId;
//   // document.getElementById("roomidfield").textContent = data.context.roomId;
//   // document.getElementById("groupidfield").textContent = data.context.groupId;
// }
