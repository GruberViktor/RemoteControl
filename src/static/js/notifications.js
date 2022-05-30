// (async () => {
//     let permission = await Notification.requestPermission();
// })();

console.log(Notification.permission);

function show_notification(headline, body) {
    note = new Notification(headline, {
        "body": body
    });

}

// function displayNotification() {
//     if (Notification.permission == 'granted') {
//         navigator.serviceWorker.getRegistration().then(function (reg) {
//             reg.showNotification('Hello world!');
//         });
//     }
// }

// const registerServiceWorker = async () => {
//     const swRegistration = await navigator.serviceWorker.register('/static/service-worker.js');
//     return swRegistration;
// }

const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
    }
}

const requestPermission = async () => { //notice I changed main to async function so that I can use await for registerServiceWorker
    const permission = await requestNotificationPermission();
}
