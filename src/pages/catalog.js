
const sortFilter = document.getElementById('sort-filter');
const dropdownContent = document.querySelector('.dropdown-content');
const dropArrow = document.getElementById('dropdown-arrow');

sortFilter.addEventListener('click', () => {
     dropdownContent.classList.toggle('open');
     dropArrow.classList.toggle('open');
});

document.addEventListener("DOMContentLoaded", () => {

    const rangeHandler = document.querySelectorAll('.slider-handler');
    const inputValue = document.querySelectorAll('.price-container input');

    let activeHandler = null;
    let container = document.querySelector(".slider-container");
    let priceGap = 12.5;

    let leftValue = 0;
    let rightValue = 100;

    rangeHandler[0].style.left = leftValue + "%";
    rangeHandler[1].style.left = rightValue + "%";

    rangeHandler.forEach(handler => {
        handler.addEventListener("mousedown", () => {
            activeHandler = handler;
        });
    });

    document.addEventListener("mousemove", e => {
        if (activeHandler != null) {

            let containerData = container.getBoundingClientRect();

            let calculatedPos = (e.clientX - containerData.left) / containerData.width * 100;
            
            let mousePosition = Math.min(Math.max(calculatedPos, 0), 100);

            if (activeHandler === rangeHandler[0]) {
                mousePosition = Math.min(mousePosition, rightValue - priceGap);
                leftValue = mousePosition;

                const price = Math.round(50 + (mousePosition / 100) * (4500 - 50));
                inputValue[0].value = price;
            } 
            else {
                mousePosition = Math.max(mousePosition, leftValue + priceGap);
                rightValue = mousePosition;
                
                const price = Math.round(50 + (mousePosition / 100) * (4500 - 50));
                inputValue[1].value = price;
            }

            activeHandler.style.left = mousePosition + "%";
        }

        inputValue[0].addEventListener("input", () => {
            let value = Number(inputValue[0].value);
            let percent = (value - 50) / (4500 - 50) * 100;
            leftValue = Math.min(percent, rightValue - priceGap);
            rangeHandler[0].style.left = leftValue + "%";
        });

        inputValue[1].addEventListener("input", () => {
            let value = Number(inputValue[1].value);
            let percent = (value - 50) / (4500 - 50) * 100;
            rightValue = Math.max(percent, leftValue + priceGap);
            rangeHandler[1].style.left = rightValue + "%";
        });
    });

    rangeHandler.forEach(handler => {
        handler.addEventListener("mouseover", (e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.transition = "transform 0.2s ease";
        });
    });

    handler.addEventListener("mouseout", (e) => {
        // перевірка куди пішла мишка
        if (!e.relatedTarget || !e.target.contains(e.relatedTarget)) {
            e.target.style.transform = "scale(1)";
        }
    });

    document.addEventListener("mouseup", () => {
        activeHandler = null;
    });
});


