export const handleSlideRight = (element) => {
    const slider = document.getElementById(element);
    slider.scrollLeft += 200;
}

export const handleSlideLeft = (element) => {
    const slider = document.getElementById(element);
    slider.scrollLeft -= 200;
}