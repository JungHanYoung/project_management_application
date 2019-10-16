
const body = document.querySelector('body')
const sidebar = document.querySelector('.sidebar');
const dropdown = document.querySelector('.sort-dropdown');

sidebar.addEventListener("mouseover", () => {
    console.log('mouse over');
    body.classList.add('hover');

});
sidebar.addEventListener("mouseleave", () => {
    body.classList.remove('hover');
});

window.addEventListener('resize', (e) => {
    if (window.innerWidth <= 1000) {
        console.log('inner');
    }
})

function toggleDropdown(e) {
    const parent = e.target.parentNode;
    parent.classList.toggle('drop');
}

dropdown.addEventListener('click', toggleDropdown);
dropdown.addEventListener('blur', () => {
    e.target.parentNode.classList.remove('drop');
})