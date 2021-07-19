"use strict";

var expected=null;
var game=null;
var gameData=null;
var highlightMode="varpitch";
var inputPosition=null;
var isScripted=false;
var jszm=null
var moreHeight=0;
var spacer=null;
var saveGame=null;
var saveLocation=1;
var saveGames=[];
var cBkg="#00FF00";
var saveGameName="zork1";


function setSaveLocation(x) {
  elem("ss1").style.background=null;
  elem("ss2").style.background=null;
  elem("ss3").style.background=null;
  elem("ss4").style.background=null;
  elem("ss5").style.background=null;
  elem("ss6").style.background=null;
/*
  elem("ss7").style.background=null;
  elem("ss8").style.background=null;
  elem("ss9").style.background=null;
  elem("ss10").style.background=null;
*/
  elem("ss" + x).style.background=cBkg;
  saveLocation=x;
  elem("command").focus();
}

function pad2(n) { return n < 10 ? '0' + n : n }


alert( date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() ) );

function saveSaveToFile(x) {
  var date = new Date();
  var ymd =  date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() ) ;
  // download(saveGames[x],"savegame" + (x-5) + ".z3s","text/plain");
  download(saveGames[x],saveGameName + "-" + ymd + ".z3s","text/plain");
}
  

/* Array of bytes to Base64 string decoding */

function b64ToUint6 (nChr) {

  return nChr > 64 && nChr < 91 ?
      nChr - 65
    : nChr > 96 && nChr < 123 ?
      nChr - 71
    : nChr > 47 && nChr < 58 ?
      nChr + 4
    : nChr === 43 ?
      62
    : nChr === 47 ?
      63
    :
      0;

}

function base64DecToArr (sBase64, nBlocksSize) {

  var
    sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
    nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;

    }
  }

  return taBytes;
}

/* Base64 string to array encoding */

function uint6ToB64 (nUint6) {

  return nUint6 < 26 ?
      nUint6 + 65
    : nUint6 < 52 ?
      nUint6 + 71
    : nUint6 < 62 ?
      nUint6 - 4
    : nUint6 === 62 ?
      43
    : nUint6 === 63 ?
      47
    :
      65;

}

function base64EncArr (aBytes) {

  var nMod3 = 2, sB64Enc = "";

  for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    nMod3 = nIdx % 3;
    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
      sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
      nUint24 = 0;
    }
  }

  return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');

}

/* UTF-8 array to DOMString and vice versa */

function UTF8ArrToStr (aBytes) {

  var sView = "";

  for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
    nPart = aBytes[nIdx];
    sView += String.fromCharCode(
      nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
        /* (nPart - 252 << 30) may be not so safe in ECMAScript! So...: */
        (nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
        (nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
        (nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
        (nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
      : nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
        (nPart - 192 << 6) + aBytes[++nIdx] - 128
      : /* nPart < 127 ? */ /* one byte */
        nPart
    );
  }

  return sView;

}

function strToUTF8Arr (sDOMStr) {

  var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;

  /* mapping... */

  for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
    nChr = sDOMStr.charCodeAt(nMapIdx);
    nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
  }

  aBytes = new Uint8Array(nArrLen);

  /* transcription... */

  for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
    nChr = sDOMStr.charCodeAt(nChrIdx);
    if (nChr < 128) {
      /* one byte */
      aBytes[nIdx++] = nChr;
    } else if (nChr < 0x800) {
      /* two bytes */
      aBytes[nIdx++] = 192 + (nChr >>> 6);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x10000) {
      /* three bytes */
      aBytes[nIdx++] = 224 + (nChr >>> 12);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x200000) {
      /* four bytes */
      aBytes[nIdx++] = 240 + (nChr >>> 18);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else if (nChr < 0x4000000) {
      /* five bytes */
      aBytes[nIdx++] = 248 + (nChr >>> 24);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    } else /* if (nChr <= 0x7fffffff) */ {
      /* six bytes */
      aBytes[nIdx++] = 252 + (nChr >>> 30);
      aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
      aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
      aBytes[nIdx++] = 128 + (nChr & 63);
    }
  }

  return aBytes;

}
function cls() {
  moreHeight=0;
  elem("text").innerHTML="";
  elem("text").appendChild(spacer);
}

function do_key(ev) {
  if(ev.key=="Enter") {
    ev.preventDefault();
    if(game) story_execute(elem("command").value);
  }
}

function story_save(x) {
  saveGames[saveLocation]=x;
  if (saveLocation>5) {
     saveSaveToFile(saveLocation);
  }
  return true;
}

function story_restore() {
  if (saveLocation>5) {
	readSave();
  }
  return saveGames[saveLocation];
}

function do_start() {
  if(!gameData) return false;
  elem("start").disabled=true;
  elem("story").disabled=true;
  jszm=new JSZM(gameData);
  jszm.highlight=story_highlight;
  jszm.print=story_print;
  jszm.save=story_save;
  jszm.restore=story_restore;
  jszm.restarted=cls;
  jszm.updateStatusLine=jszm.statusType?story_status_time:story_status_score;
  game=jszm.run();
  expected=null;
  story_execute();
  return false;
}

function elem(x) {
  return document.getElementById(x);
}

function file_changed() {
  var x=new FileReader();
  cls();
  elem("start").disabled=true;
  x.onload=ready_to_start;
  x.readAsArrayBuffer(elem("story").files[0]);
  return true;
}

function readSave() {
  var x=new FileReader();
  x.onload=function(){
	saveGames[saveLocation]=new Uint8Array(x.result);
  }
  x.readAsArrayBuffer(elem("restorestory").files[0]);
  elem("command").focus();
}

  

function ready_to_start(e) {
  var a;
  gameData=e.target.result;
  elem("start").disabled=false;
}

function screen_resize() {
  var z=elem("text");
  //var v=z.scrollTop==elem("text").scrollTopMax;
  z.style.display="none";
  z.style.minHeight=z.style.maxHeight=window.innerHeight-elem("screen").clientHeight-9;
  if(!spacer) {
    spacer=document.createElement("div");
    spacer.style.marginTop=spacer.style.marginBottom=0;
    spacer.style.paddingTop=spacer.style.paddingBottom=0;
    z.appendChild(spacer);
  }
  z.style.display="block";
  spacer.style.height=z.clientHeight;
  //if(v) z.scrollTop=z.scrollTopMax;
  return true;
}

function show_input_position() {
  inputPosition=document.createElement("span");
  inputPosition.setAttribute("class","cursor");
  inputPosition.textContent="\u2583";
  elem("text").appendChild(inputPosition);
}

function story_execute(t) {
  if(typeof expected=="number") {
    inputPosition.setAttribute("class",highlightMode+" input");
    inputPosition.textContent=t+"\n";
    inputPosition=null;
    moreHeight=0;
  } else if(expected==JSZM_Terminated) {
    return;
  } else if(expected==JSZM_MorePrompt) {
    elem("text").scrollTop+=elem("text").clientHeight;
    moreHeight-=elem("text").clientHeight;
    if(moreHeight<0) moreHeight=0;
  }
  expected=game.next(t).value;
  elem("command").placeholder="";
  elem("command").value="";
  elem("command").focus();
  elem("command").maxLength=0;
  if(expected==JSZM_MorePrompt) {
    elem("command").placeholder="[MORE]";
  } else if(expected==JSZM_SavePrompt || expected==JSZM_RestorePrompt) {
    return story_execute();
  } else if(expected==JSZM_Terminated) {
    elem("command").placeholder="[DONE]";
  } else if(typeof expected=="number") {
    moreHeight=0;
    elem("command").maxLength=expected;
    show_input_position();
  }
}

function story_highlight(x) {
  highlightMode=x?"fixpitch":"varpitch";
}

function story_print(x) {
  var z=elem("text");
  var e=document.createElement("span");
  var t=document.createTextNode(x);
  var y=z.scrollTop;
  e.setAttribute("class",highlightMode);
  e.appendChild(t);
  z.appendChild(e);
  //moreHeight+=z.scrollTopMax-y;
  moreHeight+=(z.scrollHeight - z.clientHeight)-y;
  if(moreHeight>z.clientHeight) {
    z.scrollTop+=z.clientHeight;
    return true;
  } else {
    z.scrollTop=z.scrollHeight - z.clientHeight;
    // z.scrollTop=z.scrollTopMax;
    return false;
  }
}

function story_status_score(title,score,moves) {
  elem("status").textContent=title;
}

function story_status_time(title,hours,minutes) {
  elem("status").textContent=title;
}

function loadZ1() {
gameData=base64DecToArr(zork1).buffer;
saveGameName="zork1";
do_start();
}

function loadZ2() {
gameData=base64DecToArr(zork2).buffer;
saveGameName="zork2";
do_start();
}

function loadZ3() {
gameData=base64DecToArr(zork3).buffer;
saveGameName="zork3";
do_start();
}

function loadWB() {
gameData=base64DecToArr(wishBringer).buffer;
saveGameName="wishbringer";
do_start();
}

function loadHHGTTG() {
gameData=base64DecToArr(hhgttg).buffer;
saveGameName="hhgttg";
do_start();
}

function loadSS() {
gameData=base64DecToArr(seastalker).buffer;
saveGameName="seastalker";
do_start();
}

function loadW() {
gameData=base64DecToArr(witness).buffer;
saveGameName="witness";
do_start();
}

function loadPF() {
gameData=base64DecToArr(planetfall).buffer;
saveGameName="planetfall";
do_start();
}

function loadCT() {
gameData=base64DecToArr(cutthroats).buffer;
saveGameName="cutthroats";
do_start();
}

function loadBH() {
gameData=base64DecToArr(ballyhoo).buffer;
saveGameName="ballyhoo";
do_start();
}

function loadLGOP() {
gameData=base64DecToArr(lgop).buffer;
saveGameName="lgoPhobos";
do_start();
}

function loadENCH() {
gameData=base64DecToArr(ench).buffer;
saveGameName="ench";
do_start();
}
