var openEls = document.getElementsByClassName('open');
for(var i = 0; i < openEls.length; i++){
  var open = openEls[i];
  open.onclick = function(){
    var index = this.id.split('-')[1];
    var modal = document.getElementById('myModal-' + index);
    modal.style.display = 'flex';
  }
}

var closeEls = document.getElementsByClassName('close');
for(var j = 0; j < closeEls.length; j++){
  var close = closeEls[j];
  close.onclick = function(){
    var closeIndex = this.id.split('-')[1];
    var modal = document.getElementById('myModal-' + closeIndex);
    modal.style.display = 'none';
  }
}

document.addEventListener('click', event => {
  if (event.target.className == 'modal') {
    event.target.style.display = 'none';
  }
});