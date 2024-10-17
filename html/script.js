let buttonParams = [];

// Function to open the menu with given data
const openMenu = (data = null) => {
    let html = "";
    data.forEach((item, index) => {
        if (!item.hidden) {
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let isDisabled = item.disabled;
            let icon = item.icon;
            html += getButtonRender(header, message, index, isMenuHeader, isDisabled, icon);
            if (item.params) buttonParams[index] = item.params;
        }
    });

    $("#buttons").html(html);

    // Add click event for buttons
    $('.button').click(function () {
        const target = $(this);
        if (!target.hasClass('title') && !target.hasClass('disabled')) {
            postData(target.attr('id'));
        }
    });
};

// Function to generate button HTML
const getButtonRender = (header, message = null, id, isMenuHeader, isDisabled, icon) => {
    return `
        <div class="${isMenuHeader ? "title" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon"> 
                <img src="${icon}" width="30px" onerror="this.onerror=null; this.remove();"> 
                <i class="${icon}" onerror="this.onerror=null; this.remove();"></i> 
            </div>
            <div class="column">
                <div class="header"> ${header}</div>
                ${message ? `<div class="text">${message}</div>` : ""}
            </div>
        </div>
    `;
};

// Function to close the menu
const closeMenu = () => {
    $("#buttons").html(" ");
    buttonParams = [];
    $("#container").hide(); // Hide the container to ensure it doesn't affect visibility
};

// Function to send button data to server
const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

// Function to cancel the menu
const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};

// Listen for messages from the server
window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            $("#container").show(); // Show the container when the menu is opened
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

// Listen for keyup events to cancel the menu
document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode === "Escape") {
        cancelMenu();
    }
};

// Initialization to prevent automatic opening
$(document).ready(function () {
    closeMenu(); // Ensure the menu is closed on initial load
    $("#container").hide(); // Additionally hide the container if necessary
});
