
    const sortFilter = document.getElementById('sort-filter');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropArrow = document.getElementById('dropdown-arrow');

    sortFilter.addEventListener('click', () => {
        dropdownContent.classList.toggle('open');
        dropArrow.classList.toggle('open');
    });
