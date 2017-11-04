//Circular Nav
(function(){

  let button = document.getElementById('cn-button'),
    wrapper = document.getElementById('cn-wrapper');

  //open and close menu when the button is clicked
  let open = false;
  button.addEventListener('click', handler, false);

  function handler(){
    if(!open){
	    classie.add(wrapper, 'opened-nav');
    } else{
      classie.remove(wrapper, 'opened-nav');
    }
    open = !open;
  }
  function closeWrapper(){
    classie.remove(wrapper, 'opened-nav');
  }

})();
