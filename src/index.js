// import fetch from 'node-fetch';

const clans = [];
let allCount = [];



const getClans = async () => {
    // const clanURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXM-ulyWgRCoURaqhs4s8_48D5m9vfUCFmqpOeZA6ZgH2kSLnEP-IIqbj9Z-6fHCgafc8skv5vj8hC/pub?gid=0&single=true&output=csv';

   try {
    const clanURL = 'https://corsproxy.io/?' + encodeURIComponent('https://docs.google.com/spreadsheets/d/e/2PACX-1vRXM-ulyWgRCoURaqhs4s8_48D5m9vfUCFmqpOeZA6ZgH2kSLnEP-IIqbj9Z-6fHCgafc8skv5vj8hC/pubhtml?gid=0&single=true');

    const res = await fetch(clanURL);
    const text = await res.text();
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");
    const links = html.querySelectorAll('tr a')
    if(!links.length) return;

    links.forEach(l => {
        clans.push(l.textContent);
    });


    console.log('clans', clans);

    // console.log(html);
   } catch (error) {
    console.log(error);
   }

};


let lowValue = 'text';
const clanFinder =async (url, ind) => {
        try {

            const newURL = 'https://corsproxy.io/?' + encodeURIComponent(url);

            const res = await fetch(newURL);
            const text = await res.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(text, "text/html");
            
            const count = html.querySelector(".membercount");
                
            const number = count.textContent.match(/\d{1,2}/);


            if(number.length === 0) return;

            allCount.push({
                ind: ind, 
                value: Number(number[0])
            });
            
            if((ind !== 0 && lowValue > Number(number[0])) || ind === 0){   
                    lowValue = ind;
            }

            if(ind === clans.length -1) window.dispatchEvent(new Event('parse-finish'));
         
        } catch (e) {
          console.warn(e);
        }
}


(async () => {

    await getClans();
    clans.forEach(clanFinder);

    window.addEventListener('parse-finish', function(){
        window.location.href = clans[lowValue];
        // console.log(lowValue, allCount);
    });
})()



