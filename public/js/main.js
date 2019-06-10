const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

const exportFnPopup = _ => {
  let modal = document.getElementById('myModal');
  modal.style.display = "block";
  var closeSpan = document.getElementById('closeSpan');
  closeSpan.onclick = _ => modal.style.display = "none";
}
const copyFnUrl = _ => {
  let url = document.getElementById('fnUrl');
  url.select();
  document.execCommand('copy');
};