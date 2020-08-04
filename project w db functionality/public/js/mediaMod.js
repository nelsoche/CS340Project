/* Media functions to help the media page */

function deleteMedia(mediaID){
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

    req.open('DELETE', '/media/' + mediaID, true);
	req.send(null);
};

// Function to sort the media
function sortMEdia(){
    var sortBy = document.getElementById('sortBy').value;
    
    window.location = '/media/sort/' + parseInt(sortBy);
};
