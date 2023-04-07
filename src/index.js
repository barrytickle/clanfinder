// import fetch from 'node-fetch';

const clans = [];
let allCount = [];





const getClans = async () => {
    // const clanURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXM-ulyWgRCoURaqhs4s8_48D5m9vfUCFmqpOeZA6ZgH2kSLnEP-IIqbj9Z-6fHCgafc8skv5vj8hC/pub?gid=0&single=true&output=csv';

   try {
    const clanURL = 'https://corsproxy.io/?' + encodeURIComponent('https://docs.google.com/spreadsheets/d/e/2PACX-1vRXM-ulyWgRCoURaqhs4s8_48D5m9vfUCFmqpOeZA6ZgH2kSLnEP-IIqbj9Z-6fHCgafc8skv5vj8hC/pub?output=csv');

    const res = await fetch(clanURL);
    const text = await res.text();

    const split = (text.trim().split('groupid='));


    split.forEach(s => {
        const match = s.match(/\d{3,9}/g);
        if(!!!match) return;
        clans.push({
            url: match[0],
        });
        // clans.push(match[0]);
    });
   } catch (error) {
    console.log(error);
   }

};


let lowValue = 'text';
let attempts = 0;
const populateClans = async(clan, ind) => {
try {
    const newURL = `https://www.bungie.net/Platform/GroupV2/${clan.url}`;
    const res = await fetch(newURL, {
        method:'GET',
        headers: {
            'X-API-Key': '02199866e269443887e47a0bf44aabd8',
        }
    });
    const text = await res.text();
    const json = JSON.parse(text);

    if(!json.Response.detail === undefined) return;
    const {detail} = json.Response;

    const {memberCount} = detail;

    if((lowValue.number > memberCount) || attempts === 0){
        lowValue = {ind: ind, number: memberCount, name: detail.name};
    }






    if(attempts === clans.length -1) window.dispatchEvent(new Event('parse-complete'));

    attempts++;
} catch (error) {
    console.log(error);
}
};
const clanFinder = async (url, ind) => {
        try {
           

            return true;
         
        } catch (e) {
          console.warn(e);
        }
}


const parseClans = async () => {
    // console.log('clans', clans);
}

(async () => {


    const {href} = window.location;

    if(!href.includes('localhost:3000') && !href.includes('directactionclan') && !href.includes('barrytickle-vercel'))return;

    await getClans();
    clans.forEach(populateClans);  

    window.addEventListener('parse-complete', function(){
        console.log('lowValue', lowValue);
        const url = `https://www.bungie.net/en/ClanV2?groupid=${clans[lowValue.ind].url}`
        console.log(`https://www.bungie.net/en/ClanV2?groupid=${clans[lowValue.ind].url}`);
        window.location.href = url;
    });

})()



