const $btnLogout = document.getElementById('btnLogout');

$btnLogout.addEventListener('click', (e) => {
    location.href = '/user/logout';
});