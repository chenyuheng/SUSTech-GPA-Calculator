$(document).ready(function(){
    $('.pushpin').pushpin({
        top: 0,
        bottom: 1000,
        offset: 0
    });
});

window.onresize = function(){
    adopt();
}

function adopt() {
    if (window.innerWidth > 992) {
        document.getElementById("pinned").className = "toc-wrapper pinned";
    } else {
        document.getElementById("pinned").className = "";
    }
}

adopt();