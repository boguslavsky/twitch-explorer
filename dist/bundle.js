!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){const n=document.getElementById("loader"),r=document.getElementById("welcome_msg"),o=document.getElementById("not_found_msg"),s=document.getElementById("error_msg"),a=document.getElementById("stream_list"),l=document.getElementById("search_form"),u=document.getElementById("search_query"),c=document.getElementById("total"),d=document.getElementById("prev_btn"),i=document.getElementById("next_btn"),m=document.getElementById("current_page"),f=document.getElementById("total_pages");let h="",p="";const y=e=>{const t=[];return e.toString().split("").reverse().forEach((e,n)=>{n>0&&n%3==0&&t.push(","),t.push(e)}),t.reverse().join("")},v=e=>{e.classList.contains("hidden")||e.classList.add("hidden")},g=e=>{e.classList.contains("hidden")&&e.classList.remove("hidden")},b=e=>{s.textContent=e,g(s)},E=e=>`<li class="stream">\n        <a class="stream-link" href="${e.channel.url}" target="_blank">\n            <img class="stream-thumb" src="${e.preview.medium}">\n            <h2 class="stream-title">${e.channel.status}</h2>\n            <p class="stream-text">${e.game} - ${y(e.viewers)} viewers</p>\n            <p class="stream-text">${e.channel.name} • started ${(e=>{const t=Math.floor(((new Date).getTime()-new Date(e).getTime())/1e3),n=Math.floor(t/60)%60,r=Math.floor(t/60/60)%24,o=Math.floor(t/60/60/24);let s="";return o>0&&(s+=`${o}d `),r>0&&(s+=`${r}h `),n>0&&(s+=`${n}m `),""===s&&(s="less than a minute"),s})(e.created_at)} ago • ${y(e.channel.views)} total views</p>\n        </a>\n    </li>`,w=()=>{let e=a.lastElementChild;for(;e;)a.removeChild(e),e=a.lastElementChild;v(r),v(o),v(s)},_=()=>{let e=`?query=${h}`;return p&&(e+=`&offset=${p}`),e},I=e=>{g(n),i.disabled=!0,d.disabled=!0,(e=>new Promise((t,n)=>{const r=new XMLHttpRequest;r.open("GET",e),r.responseType="json",r.setRequestHeader("Client-ID","rnol6rl7vokxusycd1dk7rqbddb2nw"),r.send(),r.onload=(()=>{if(200===r.status)t(r.response);else{if(r.response.error)return void n(new Error(`Error ${r.status}: ${r.response.error}`));n(new Error(`Error ${r.status}: ${r.statusText}`))}}),r.onerror=(()=>{n(new Error("Network error"))})}))(`https://api.twitch.tv/kraken/search/streams${e}&limit=10`).then(e=>{if(c.textContent=e._total,0===e._total)return m.textContent="−",f.textContent="−",g(o),void v(n);m.textContent=Math.floor(p/10)+1,f.textContent=Math.ceil(e._total/10),p+10<e._total&&(i.disabled=!1,i.value=p+10),p-10>=0&&(d.disabled=!1,d.value=p-10);let t="";e.streams.forEach(e=>{t+=E(e)}),a.insertAdjacentHTML("afterbegin",t),v(n)}).catch(e=>{b(e.message),v(n)})};l.addEventListener("submit",e=>{e.preventDefault();const t=u.value;if(""===t)return void b("The search query cannot be empty.");try{h=encodeURI(t)}catch(e){return void b("An error occurred while processing a search query. Incorrect characters were used.")}w(),p=0;const n=_();history.pushState({query:h,offset:p},null,n),I(n)}),d.addEventListener("click",()=>{w(),p=parseInt(d.value);const e=_();history.pushState({query:h,offset:p},null,e),I(e)}),i.addEventListener("click",()=>{w(),p=parseInt(i.value);const e=_();history.pushState({query:h,offset:p},null,e),I(e)}),window.addEventListener("popstate",e=>{if(!e.state||void 0===e.state.query)return;w(),u.value=decodeURI(e.state.query),h=e.state.query,p=e.state.offset;const t=_();I(t)}),(()=>{const e=new URLSearchParams(window.location.search),t=e.get("query"),n=e.get("offset");if(!t)return;u.value=decodeURI(t),h=t,p=n?parseInt(n):0,w();const r=_();I(r)})()}]);