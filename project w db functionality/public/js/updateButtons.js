function deleteWeapon(characterID, weaponID){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location.replace("/char_update/" + characterID);
        }
        else{
            window.location.replace("/char_update/" + characterID);
			console.log('Error in network request: ' + req.status);
        }
    };
    req.open('DELETE', '/char_update/character/' + characterID + '/weapon/' + weaponID, true);
	req.send(null);
};

function deleteMedia(characterID, mediaID){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location.replace("/char_update/" + characterID);
        }
        else{
            window.location.replace("/char_update/" + characterID);
			console.log('Error in network request: ' + req.status);
        }
    };
    req.open('DELETE', '/char_update/character/' + characterID + '/media/' + mediaID, true);
	req.send(null);
};