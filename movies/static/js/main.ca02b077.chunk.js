(window["webpackJsonpreact-ts-movie"]=window["webpackJsonpreact-ts-movie"]||[]).push([[0],{24:function(e,t,a){e.exports=a.p+"static/media/git.773d7266.svg"},25:function(e,t,a){e.exports=a.p+"static/media/in.26f6e88f.svg"},26:function(e,t,a){e.exports=a.p+"static/media/mail.ad1c1b93.svg"},27:function(e,t,a){e.exports=a.p+"static/media/t.d6b00025.svg"},28:function(e,t,a){e.exports=a(48)},33:function(e,t,a){},40:function(e,t,a){},41:function(e,t,a){},42:function(e,t,a){},43:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){},46:function(e,t,a){},47:function(e,t,a){},48:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(21),i=a.n(c),l=a(2),o=a(4),s=a(6),u=a(5),m=a(7),b=a(10),d=(a(33),function(){return r.a.createElement("div",null,r.a.createElement("nav",{className:"navbar fixed-top navbar-light bg-light"},r.a.createElement(b.b,{to:"/"},r.a.createElement("svg",{viewBox:"0 0 82 78",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"logo-img"},r.a.createElement("path",{d:"M5.99209 0.00585938H76.0078C79.374 0.00585938 81.996 2.62791 81.996 5.99405V72.0059C81.996 75.3366 79.374 77.994 76.0078 77.994H5.99209C2.66139 77.994 0.00390625 75.3366 0.00390625 72.0059V5.99405C0.00390625 2.62791 2.66139 0.00585938 5.99209 0.00585938ZM9.00391 4.0098V11.9822H17.0118V4.0098H9.00391ZM23 4.0098V11.9822H31.0078V4.0098H23ZM36.996 4.0098V11.9822H45.0039V4.0098H36.996ZM50.9921 4.0098V11.9822H59V4.0098H50.9921ZM64.9882 4.0098V11.9822H72.996V4.0098H64.9882ZM13.0078 15.9862C9.71257 16.3051 7.05509 18.998 7.01965 22.0098V55.9901C7.33855 59.2854 10.0315 61.9429 13.0078 61.9783H68.9921C72.2874 61.6594 74.9449 58.9665 75.0157 55.9901V22.0098C74.6614 18.6791 72.0039 16.057 68.9921 15.9862H13.0078ZM27.996 24.6673V53.2618C37.3858 48.4074 47.2008 43.1988 55.3149 38.9822C45.3228 33.7381 37.0315 29.3799 27.996 24.6673V24.6673ZM9.00391 65.9822V73.9901H17.0118V65.9822H9.00391ZM23 65.9822V73.9901H31.0078V65.9822H23ZM36.996 65.9822V73.9901H45.0039V65.9822H36.996ZM50.9921 65.9822V73.9901H59V65.9822H50.9921ZM64.9882 65.9822V73.9901H72.996V65.9822H64.9882Z",fill:"#1a1a1a"}))),r.a.createElement("div",null,r.a.createElement(b.b,{to:"/",className:"btn btn-link"},"main page"),r.a.createElement(b.b,{to:"/library",className:"btn btn-link"},"my library"))))}),p=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).state={value:""},a.onSubmitHandler=function(e){e.preventDefault(),a.props.onSearchHandler(a.state.value)},a.onChangeSubmit=function(e){a.setState({value:e.target.value})},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement("form",{onSubmit:this.onSubmitHandler},r.a.createElement("div",{className:"form-group"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"Enter movie title",value:this.state.value,onChange:this.onChangeSubmit})),r.a.createElement("div",{className:"form-group"},r.a.createElement("button",{type:"submit",className:"btn btn-block btn-outline-primary"},"Search film")))}}]),t}(n.Component),f=a(13),v=a.n(f),h=a(15),E=function e(){var t=this;Object(l.a)(this,e),this._apiBase="http://omdbapi.com/?apikey=5b411c37&",this.getResource=function(){var e=Object(h.a)(v.a.mark((function e(t){var a;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t);case 2:if((a=e.sent).ok){e.next=5;break}throw new Error("Not fetch ".concat(t,", status ").concat(a.status));case 5:return e.next=7,a.json();case 7:return e.abrupt("return",e.sent);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this.getAllMovies=function(){var e=Object(h.a)(v.a.mark((function e(a){return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getResource("".concat(t._apiBase,"s=").concat(a));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this.getMovieInfo=function(){var e=Object(h.a)(v.a.mark((function e(a){var n;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getResource("".concat(t._apiBase,"i=").concat(a,"&plot=full"));case 2:return n=e.sent,console.log(n),e.abrupt("return",t._transformInfo(n));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this._transformInfo=function(e){return{Poster:e.Poster,Title:e.Title,Year:e.Year,Awards:e.Awards,imdbRating:e.imdbRating,imdbVotes:e.imdbVotes,Actors:e.Actors,Country:e.Country,Runtime:e.Runtime,Genre:e.Genre,Plot:e.Plot}}},g=(a(40),function(){return r.a.createElement("div",{className:"loader"},"Loading...")}),y=(a(41),a(42),function(e){var t=e.Poster,a=e.Title,n=e.imdbID;return r.a.createElement("div",{className:"card"},r.a.createElement("img",{src:"N/A"===t?"http://dummyimage.com/300x424/6CC3D5":t,alt:a}),r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-title"},a),r.a.createElement(b.b,{to:"/detail/".concat(n),className:"btn btn-primary"},"View detail")))}),N=function(e){var t=e.movies;if(!t)return r.a.createElement(g,null);var a=t.map((function(e){return r.a.createElement(y,{key:e.imdbID,imdbID:e.imdbID,Poster:e.Poster,Title:e.Title})}));return r.a.createElement("div",{className:"card-wrap"},a)},j=(a(43),function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).movieService=new E,a.state={movies:[],title:""},a.onSearchHandler=function(e){a.setState({title:e})},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidUpdate",value:function(e,t){t.title!==this.state.title&&this.updateMovie()}},{key:"updateMovie",value:function(){var e=this,t=this.state.title;t&&this.movieService.getAllMovies(t).then((function(t){e.setState({movies:t.Search})}))}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",{className:"container mt-5"},r.a.createElement(p,{onSearchHandler:this.onSearchHandler})),r.a.createElement("div",{className:"container-fluid mt-5"},r.a.createElement(N,{movies:this.state.movies})))}}]),t}(n.Component)),w=function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement("div",null,"LibraryPage")}}]),t}(n.Component),O=(a(44),function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"controls"},r.a.createElement("button",{type:"button",className:"btn btn-outline-secondary"},"Mark as viewed"),r.a.createElement("button",{type:"button",className:"btn btn-outline-secondary"},"Plan view"),r.a.createElement("button",{type:"button",className:"btn btn-outline-secondary"},"Add to favorites"))}}]),t}(n.Component)),V=(a(45),function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return(a=Object(s.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(r)))).movieService=new E,a.state={Poster:"",Title:"",Year:"",Awards:"",Rating:"",Votes:"",Actors:"",Country:"",Runtime:"",Genre:"",Plot:""},a.renderInfo=function(e){return a.movieService.getMovieInfo(e).then((function(e){a.setState({Poster:e.Poster,Title:e.Title,Year:e.Year,Awards:e.Awards,Rating:e.imdbRating,Votes:e.imdbVotes,Actors:e.Actors,Country:e.Country,Runtime:e.Runtime,Genre:e.Genre,Plot:e.Plot})}))},a}return Object(m.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=this.props.id;this.renderInfo(e)}},{key:"render",value:function(){var e=this.state,t=e.Poster,a=e.Title,c=e.Year,i=e.Rating,l=e.Votes,o=e.Actors,s=e.Plot,u=e.Awards,m=e.Genre,b=e.Country,d=e.Runtime;return r.a.createElement(n.Fragment,null,r.a.createElement("div",{className:"container mt-5"},r.a.createElement("div",{className:"detail-card"},r.a.createElement("div",{className:"detail-card__col"},r.a.createElement("img",{src:"N/A"===t?"http://dummyimage.com/300x424/6CC3D5":t,alt:a})),r.a.createElement("div",{className:"detail-card__col"},r.a.createElement("h1",{className:"h1"},a," ",r.a.createElement("span",{className:"badge badge-primary"},c)),r.a.createElement("p",null,s),r.a.createElement("p",null,r.a.createElement("strong",null,"Awards:")," ",u),r.a.createElement("p",null,r.a.createElement("strong",null,"Rating:")," ",r.a.createElement("span",{className:"badge badge-primary"},i," / 10")," ",r.a.createElement("span",{className:"votes"},l," votes")),r.a.createElement("p",null,r.a.createElement("strong",null,"Actors:")," ",o),r.a.createElement("p",null,r.a.createElement("strong",null,"Country:")," ",b),r.a.createElement("p",null,r.a.createElement("strong",null,"Genre:")," ",m),r.a.createElement("p",null,r.a.createElement("strong",null,"Runtime:")," ",d)))),r.a.createElement("div",{className:"container mt-5"},r.a.createElement(O,null)))}}]),t}(n.Component)),C=a(24),H=a.n(C),k=a(25),A=a.n(k),M=a(26),x=a.n(M),S=a(27),P=a.n(S),R=(a(46),function(){return r.a.createElement("div",{className:"footer"},r.a.createElement("button",{type:"button",className:"btn btn-light"},r.a.createElement("img",{src:H.a,alt:"git"})),r.a.createElement("button",{type:"button",className:"btn btn-light"},r.a.createElement("img",{src:A.a,alt:"linkedin"})),r.a.createElement("button",{type:"button",className:"btn btn-light"},r.a.createElement("img",{src:x.a,alt:"mail"})),r.a.createElement("button",{type:"button",className:"btn btn-light"},r.a.createElement("img",{src:P.a,alt:"telegram"})))}),Z=a(11),I=(a(47),function(e){function t(){return Object(l.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement(b.a,null,r.a.createElement("div",{className:"app"},r.a.createElement(d,null),r.a.createElement("main",{className:"main"},r.a.createElement(Z.a,{path:"/",component:j,exact:!0}),r.a.createElement(Z.a,{path:"/detail/:id",render:function(e){var t=e.match;return r.a.createElement(V,{id:t.params.id})}}),r.a.createElement(Z.a,{path:"/library",component:w})),r.a.createElement(R,null)))}}]),t}(n.Component));i.a.render(r.a.createElement(I,null),document.getElementById("root"))}},[[28,1,2]]]);
//# sourceMappingURL=main.ca02b077.chunk.js.map