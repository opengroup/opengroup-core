document.body.dataset.grid = localStorage.getItem('grid') || 'invisible';

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && (event.keyCode === 59 || event.keyCode === 186)) {
        let newValue = document.body.dataset.grid === 'visible' ? 'invisible' : 'visible';
        document.body.dataset.grid = newValue;
        localStorage.setItem('grid', newValue);
    }
});
