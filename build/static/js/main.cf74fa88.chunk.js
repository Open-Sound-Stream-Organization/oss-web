(this.webpackJsonpweb=this.webpackJsonpweb||[]).push([[0],{14:function(e,t,a){},40:function(e,t,a){e.exports=a(57)},48:function(e,t,a){e.exports=a.p+"static/media/example-cover.b2e600a7.jpg"},57:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(28),l=a.n(o),c=a(5),i=a(16),s=a(10),u=(a(14),a(17));var m=function(e){var t=e.children,a=e.className,n=e.area,o=Object(u.a)(e,["children","className","area"]);return r.a.createElement("div",Object.assign({className:"".concat(null!==a&&void 0!==a?a:""," ").concat(n),style:{gridArea:n,position:"relative"}},o),t)};var h=function(e){var t=e.track;return r.a.createElement(m,{area:"cover"},r.a.createElement("img",{src:t.album.cover_url,alt:"Active Song Cover"}))},f=(a(20),a(13)),d=a(39),v=a(11),g=a(34),E=a(29),p=a.n(E),b=a(18),k=a(22),y=a.n(k),O=a(30),M=a(31),T=a(32),w=new(function(){function e(){Object(M.a)(this,e),this.fakes=new Map}return Object(T.a)(e,[{key:"fakeModels",value:function(e,t){var a=this;this.fake(e,(function(){return t})),t.forEach((function(t){return a.fake("".concat(e,"/").concat(t.id),(function(){return t}))}))}},{key:"fake",value:function(e,t){this.fakes.set(e,t)}},{key:"subscribe",value:function(e,t){var a=this;return{then:function(t){var n=e.match(/\??([a-zA-Z_-]+)\/?/);if(n){var r=a.fakes.get(n[1]);r?t(r()):t(void 0,new Error("Not Found"))}else t(void 0,new Error("Invalid Endpoint"));return function(){}}}}},{key:"post",value:function(){var e=Object(O.a)(y.a.mark((function e(t,a){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("Posted to '".concat(t,"' with params ").concat(a)),e.abrupt("return","Posted");case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()}]),e}());function j(e){return e[Math.floor(Math.random()*e.length)]}function S(e,t){return e.sort((function(e,t){return Math.random()-.5})).slice(0,Math.min(e.length,t))}var A=[],N=[{name:"Dieter Bohlen",tags:S(A,3),type:"P"}].map((function(e,t){return Object(b.a)({},e,{id:t})})),P=[{name:"Top 10 Nationalhymnen",release:"".concat(1960+Math.floor(60*Math.random())),artist:S(N,2),cover_url:a(48),tags:S(A,3)}].map((function(e,t){return Object(b.a)({},e,{id:t})})),C=["Daunting Moons","The Inside-Out Matter","No One Works At Anger","It Uses They","Pawns At the Spring","The Bowl Find","Obstructing History","Sing Doors","Feverish Thorns","Listen","Thoughts","From The Phantom Penguins","Rule Dos On a Prisoner","Visions In Cadenza","The Ambitious Sweet Child","The Love of Journal","The Magic's Act","Mercy Buy School","Gamble Broadcasting","On They Savior","Dreaming Universes","Missing","Bound Cigars","The Smooth Stream","I Sends Through Expression","No One Finishs Everybody","Something Without the Swords","The Harmony Imagine","Typing Activity","Try Right Now","Bare Machinations","Have","Moment","Of The Venturesome Bond","Photography Cans From a Building","Power From Serenade","The Cool Yearning","The Places of Sweet Child","The Souls's Children","Earaches Listen Crafter","Healing Kneeling","From He Person","Drooling Lines","Undoubted","Bad Outlaws","The Which Island","It Stands Under Expectations","I Puts Its","Date Under the Forever","The Death Give","Slaughtering Matter","Lose War","Solitary Body","Drink","Touch","Like The Same Fair","Building Feels Under a Rose","Flames Of Official","The Abandoned Disk","The Height of Silk","The Anything's Terror","Hope Understand Muse","Village Sailing","Through We Woman","Pleading Names","Hungry"].map((function(e,t){return{id:t,title:e,artist:S(N,1*Math.random()+1),album:j(P),length:Math.floor(100*Math.random()+100)}})),B=new Array(6).fill(null).map((function(e){return{id:e,name:"A Playlist",tags:[],tracks:S(C,5*Math.random()+6)}}));w.fakeModels("track",C),w.fakeModels("artist",N),w.fakeModels("album",P),w.fakeModels("tag",A),w.fakeModels("playlist",B),w.fake("active-track",(function(){var e=j(C);return Object(b.a)({},e,{position:Math.floor(Math.random()*e.length)})}));var F=w;function I(e,t){var a=Object(n.useState)(),r=Object(c.a)(a,2),o=r[0],l=r[1],i=Object(n.useState)(!0),s=Object(c.a)(i,2),u=s[0],m=s[1],h=p.a.encode(t),f="".concat(e,"?").concat(h);return Object(n.useEffect)((function(){return F.subscribe(f).then((function(e){l(e),m(!1)}))}),[f]),[o,u]}var x=function(){var e=I("artist"),t=Object(c.a)(e,1)[0],a=I("album"),n=Object(c.a)(a,1)[0];if(!t||!n)return r.a.createElement("p",null,"Loading");function o(){console.log("funktioniert")}return r.a.createElement(r.a.Fragment,null,r.a.createElement(f.a,{className:"ArtistsContainer"},t.map((function(e){return r.a.createElement(v.a,{className:"ListGroupArtists"},r.a.createElement(v.a.Item,{onClick:o},e.name))}))),r.a.createElement(f.a,{className:"EachArtist"},t.map((function(e){return n.map((function(t){return r.a.createElement(v.a,{className:"ListGroupForEachArtist"},r.a.createElement(d.a,null,r.a.createElement("img",{width:64,height:64,className:"mr-3",src:t.cover_url,alt:"Cover"})),r.a.createElement("p",null,t.name),r.a.createElement("p",null,t.release),r.a.createElement(g.a,null,r.a.createElement(v.a.Item,{onClick:o},e.name)))}))}))))},L=a(4),D=a.n(L);var W=function(){var e=Object(s.g)().pathname;return r.a.createElement("nav",null,r.a.createElement("ul",null,[{href:"/playlists",text:"Playlists"},{href:"/albums",text:"Albums"},{href:"/artists",text:"Artists"}].map((function(t){var a=t.text,n=t.href;return r.a.createElement("li",{key:n,className:D()({active:e===n})},r.a.createElement(i.b,{to:n},a))}))))},H=a(37),U=a(12);function V(e){var t=e.area,a=e.icon,n=Object(u.a)(e,["area","icon"]);return r.a.createElement(m,Object.assign({className:"icon-button",area:null!==t&&void 0!==t?t:""},n),r.a.createElement(H.a,{icon:a}))}function G(e){var t=Math.floor(e/60),a=e-60*t;return"".concat(t,":").concat(a.toString().padStart(2,"0"))}function R(e){var t=e.title,a=e.artist,n=e.length,o=e.position;return r.a.createElement(m,{area:"info"},r.a.createElement("h4",null,t),r.a.createElement("p",null,a.map((function(e){return e.name})).join(" | ")),r.a.createElement("div",{className:"track-progress"},r.a.createElement("span",null,G(o)),r.a.createElement("span",null,"-",G(n-o)),r.a.createElement("div",{style:{width:"".concat(o/n*100,"%")}})))}function _(){var e=function(){var e=Object(n.useState)(40),t=Object(c.a)(e,2),a=t[0],r=t[1],o=Object(n.useState)(a),l=Object(c.a)(o,2),i=l[0],s=l[1];return{volume:a,setVolume:r,toggleVolume:function(){a>0?(s(a),r(0)):r(i)}}}(),t=e.volume,a=e.setVolume,o=e.toggleVolume,l=0===t?U.f:t<50?U.e:U.g,i=function(e){console.log(e.buttons);var t=e.currentTarget.offsetWidth,n=e.currentTarget.getBoundingClientRect().left,r=e.clientX-n,o=Math.round(r/t*100);a(o)};return r.a.createElement(m,{area:"volume"},r.a.createElement(V,Object.assign({icon:l},{onClick:o})),r.a.createElement("div",{className:"bar",onClick:i,onMouseMove:function(e){e.buttons>0&&i(e)}},r.a.createElement("div",{style:{width:"".concat(t,"%")}})))}var J=function(e){var t=e.track;return r.a.createElement(m,{area:"player"},t&&r.a.createElement(R,t),r.a.createElement(V,{icon:U.c,area:"previous"}),r.a.createElement(V,{icon:U.d,area:"next"}),r.a.createElement(V,{icon:U.a,area:"play"}),r.a.createElement(V,{icon:U.b,area:"shuffle"}),r.a.createElement(_,null))},z=a(38);var K=function(){var e=I("playlist"),t=Object(c.a)(e,1)[0];return t?r.a.createElement(m,{area:"playlists"},r.a.createElement(z.a,{fluid:!0,className:"Playlist"},r.a.createElement(f.a,null,r.a.createElement("ul",null,t.map((function(e){return r.a.createElement(v.a,{className:"ListGroup",variant:"flush"},r.a.createElement(v.a.Item,{action:!0,href:"info"},e.name))})))))):r.a.createElement("p",null,"Loading")};var X=function(){var e=I("active-track"),t=Object(c.a)(e,1)[0];return r.a.createElement(i.a,null,r.a.createElement(W,null),r.a.createElement(J,{track:t}),t&&r.a.createElement(h,{track:t}),r.a.createElement(K,null),r.a.createElement(s.d,null,r.a.createElement(m,{area:"page"},r.a.createElement(s.b,{path:"/playlists"},r.a.createElement("h1",null,"Playlists")),r.a.createElement(s.b,{path:"/albums"},r.a.createElement("h1",null,"Albums")),r.a.createElement(s.b,{path:"/artists"},r.a.createElement(x,null)),r.a.createElement(s.b,{exact:!0,path:"/"},r.a.createElement(s.a,{to:"/playlists"})))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(X,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[40,1,2]]]);
//# sourceMappingURL=main.cf74fa88.chunk.js.map