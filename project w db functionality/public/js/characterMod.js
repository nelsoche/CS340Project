function deleteCharacter(characterID){
	var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location.reload(true);
        }
        else{
            window.location.reload(true);
			console.log('Error in network request: ' + req.status);
        }
    };
    req.open('DELETE', '/characters/' + characterID, true);
	req.send(null);
};

function sortCharacters(){
    var sortBy = document.getElementById('sortBy').value;
    window.location = '/characters/sort/' + parseInt(sortBy);
};

function filterByRace(){
    var race = document.getElementById('raceFilter').value;
    window.location = '/characters/filter/race/' + parseInt(race);
};

function filterByLocation(){
    var location = document.getElementById('locationFilter').value;
    window.location = '/characters/filter/location/' + parseInt(location);
};

function filterByMedia(){
    var media = document.getElementById('mediaFilter').value;
    window.location = '/characters/filter/media/' + parseInt(media);
};