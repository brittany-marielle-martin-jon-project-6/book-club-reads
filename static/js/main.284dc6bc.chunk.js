(this["webpackJsonpproject-6"]=this["webpackJsonpproject-6"]||[]).push([[0],{48:function(e,t,n){},49:function(e,t,n){},74:function(e,t,n){"use strict";n.r(t);var a=n(2),s=n(4),o=n.n(s),r=n(40),c=n.n(r),i=(n(48),n(11)),l=n(12),d=n(14),u=n(13),h=(n(49),n(9)),b=n(7),j=n(23),f=n.n(j),p=n.p+"static/media/noCover.fea3d7c6.jpg",m=n(27);n(66);m.a.initializeApp({apiKey:"AIzaSyA87pRApsH2HcpcixtBcOGe4gsRqyIwQ2s",authDomain:"project-6-507f3.firebaseapp.com",projectId:"project-6-507f3",storageBucket:"project-6-507f3.appspot.com",messagingSenderId:"418153390359",appId:"1:418153390359:web:fdacdd374f5353ad9d9752"});var x=m.a,g=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).apiCall=function(t){f()({url:"https://www.googleapis.com/books/v1/volumes",method:"GET",responseType:"json",params:{q:t,maxResults:12,startIndex:e.state.startIndex,orderBy:"relevance"}}).then((function(t){t.data.items.forEach((function(t){e.books.push(e.createBookObj(t))})),e.setState({books:e.books})})).catch((function(e){console.log(e)}))},e.createBookObj=function(t){var n={};return n.id=t.id,n.title=e.handleMissingInfoError(t.volumeInfo.title,"Unknown title"),n.authors=e.handleMissingInfoError(t.volumeInfo.authors,"Unknown author"),n.category=e.handleMissingInfoError(t.volumeInfo.categories,"Unknown genre"),n.rating=e.handleMissingInfoError(t.volumeInfo.averageRating,"No rating"),n.bookImg=e.handleMissingCoverImage(t.volumeInfo),n.pageCount=e.handleMissingInfoError(t.volumeInfo.pageCount,"Unknown page count"),n.publisher=e.handleMissingInfoError(t.volumeInfo.publisher,"Unknown publisher"),n.language=e.handleMissingInfoError(t.volumeInfo.language,"Unknown language"),n.description=e.handleMissingInfoError(t.volumeInfo.description,"No description"),n.publishedDate=e.handleMissingInfoError(t.volumeInfo.publishedDate,"Unknown published date"),n.searchInput=e.newSearch,n},e.handleButtonClick=function(t,n){var a={book:t,completed:!1,saved:n};e.dbRef.push(a)},e.handleMissingInfoError=function(t,n){return t?e.parseBookInfo(t):n},e.parseBookInfo=function(e){if("object"!==typeof e)return e;if(1===e.length)return e;if(2===e.length)return"".concat(e[0]," and ").concat(e[1]);if(e.length>2){var t="";return e.forEach((function(n,a){a===e.length-1?t+="and ".concat(n):t+="".concat(n,", ")})),t}},e.handleMissingCoverImage=function(e){return e.imageLinks?e.imageLinks.thumbnail:p},e.handleLongInfo=function(e,t){if(e.length>t){if(" "!==e.charAt(t-1)){var n=e.slice(t,e.length).search(" ");if(n<0){var a=e.length-t;a<10&&(n=a)}t+=n}e=e.slice(0,t),e+=" ..."}return e},e.renderInformation=function(t){return Object(a.jsxs)("div",{className:"result-box",style:{backgroundImage:"url(".concat(t.bookImg,")")},children:[Object(a.jsx)("img",{src:t.bookImg,alt:"Book cover for ".concat(e.handleLongInfo(t.title,40))}),Object(a.jsxs)("div",{className:"descriptionContainer",children:[Object(a.jsx)("h2",{className:"title",children:e.handleLongInfo(t.title,50)}),Object(a.jsxs)("h3",{children:["By: ",t.authors]}),Object(a.jsxs)("h3",{children:["Genre: ",t.category]}),Object(a.jsxs)("h4",{children:["Rating: ",t.rating]})]}),Object(a.jsxs)("div",{className:"buttonContainer",children:[Object(a.jsx)(h.b,{to:"/moredetails/".concat(t.title),children:Object(a.jsxs)("button",{onClick:function(){e.handleButtonClick(t,!1)},children:[Object(a.jsx)("i",{className:"fas fa-info-circle"}),"  More Details"]})}),Object(a.jsxs)("button",{onClick:function(){e.handleButtonClick(t,!0)},children:[Object(a.jsx)("i",{className:"fas fa-plus"}),"  Add to my bookshelf"]})]})]},t.id)},e.renderNoResultMessage=function(){return Object(a.jsx)("h2",{children:"No Results Found :("})},e.handleNextPage=function(){var t=e.state.startIndex+12;e.setState({startIndex:t,next:!0,pageNumber:e.state.pageNumber+1})},e.handlePreviousPage=function(){var t=e.state.startIndex-12;t<0&&(t=0),e.setState({startIndex:t,pageNumber:e.state.pageNumber-1})},e.renderPaginationButtons=function(){return Object(a.jsxs)("div",{children:[Object(a.jsx)("button",{onClick:e.handlePreviousPage,children:"Previous"}),Object(a.jsx)("button",{onClick:e.handleNextPage,children:"Next"})]})},e.newSearch="",e.dbRef=x.database().ref(),e.books=[],e.maxStartIndexOfDisplayedResults=0,e.state={books:[],startIndex:0,next:!1,pageNumber:1},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.newSearch=this.props.match.params.search,this.apiCall(this.props.match.params.search)}},{key:"componentDidUpdate",value:function(){this.newSearch!==this.props.match.params.search&&(this.newSearch=this.props.match.params.search,this.books=[],this.apiCall(this.newSearch)),this.state.next&&this.state.startIndex>this.maxStartIndexOfDisplayedResults&&(this.state.startIndex>this.maxStartIndexOfDisplayedResults&&(this.maxStartIndexOfDisplayedResults=this.state.startIndex),this.apiCall(this.newSearch),this.setState({next:!1}))}},{key:"render",value:function(){var e=this,t=this.state.books.slice(this.state.startIndex,this.state.startIndex+12);return Object(a.jsxs)("div",{children:[Object(a.jsx)("section",{className:"searchResSection",children:t?t.map((function(t){return e.renderInformation(t)})):this.renderNoResultMessage()}),this.renderPaginationButtons()]})}}]),n}(s.Component),v=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(a.jsxs)("div",{className:"landingPage",children:[Object(a.jsx)("h2",{className:"container",children:"Create the reading list of your dreams and track your progress!"}),Object(a.jsxs)("div",{className:"iconContainer",children:[Object(a.jsx)("a",{href:"#",children:Object(a.jsx)("i",{className:"fab fa-twitter"})}),Object(a.jsx)("a",{href:"#",children:Object(a.jsx)("i",{className:"fab fa-instagram"})}),Object(a.jsx)("a",{href:"#",children:Object(a.jsx)("i",{className:"fab fa-linkedin"})}),Object(a.jsx)("a",{href:"#",children:Object(a.jsx)("i",{className:"fab fa-facebook-square"})})]})]})}}]),n}(s.Component),O=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).apiCall=function(t){f()({url:"https://www.googleapis.com/books/v1/volumes",method:"GET",responseType:"json",params:{q:t,maxResults:5,startIndex:0,orderBy:"relevance"}}).then((function(t){var n=t.data.items.map((function(e){return e.volumeInfo.title}));e.setState({suggestions:n})})).catch((function(e){console.log(e)}))},e.updateUserInput=function(t){var n=t.target.value;n&&(e.newInput=!0),e.setState({userInput:n})},e.handleSubmit=function(e){e.preventDefault()},e.renderNav=function(){return Object(a.jsx)("nav",{children:Object(a.jsxs)("ul",{className:"headerNav",children:[Object(a.jsx)("li",{children:Object(a.jsx)(h.b,{to:"/",className:"navLinks",children:"Browse"})}),Object(a.jsx)("li",{children:Object(a.jsx)(h.b,{to:"/mybookshelf",className:"navLinks",children:"My Bookshelf"})})]})})},e.renderForm=function(){return Object(a.jsxs)("div",{className:"titleFormContainer",children:[Object(a.jsx)(h.b,{to:"/book-club-reads/",className:"logo",children:Object(a.jsxs)("h1",{children:[Object(a.jsx)("i",{className:"fas fa-book-open bookIcon"}),Object(a.jsx)("span",{className:"capitalB",children:"B"}),"ook Club Reads"]})}),Object(a.jsxs)("form",{onSubmit:e.handleSubmit,onChange:function(t){return e.getSuggestion(t)},children:[Object(a.jsx)("label",{htmlFor:"searchBook",className:"srOnly",children:"Search "}),Object(a.jsx)("input",{autoComplete:"off",type:"text",id:"searchbook",name:"searchbook",className:"searchBook",placeholder:"title, author, genre",value:e.state.userInput,onChange:e.updateUserInput}),Object(a.jsx)("div",{className:"suggestionContainer",children:e.state.suggestions.map((function(t,n){return e.renderSuggestion(t,n)}))}),Object(a.jsx)(h.b,{to:"/search/".concat(e.state.userInput),children:Object(a.jsx)("button",{className:"searchButton",children:Object(a.jsx)("i",{className:"fas fa-search"})})})]})]})},e.renderSuggestion=function(t,n){return t=e.handleLongInfo(t,25),Object(a.jsxs)("div",{className:"individualSuggestion",children:[Object(a.jsx)("input",{type:"radio",name:"suggestion",value:t,id:"suggestion-".concat(n)}),Object(a.jsx)("label",{htmlFor:"suggestion-".concat(n),children:t})]},n)},e.getSuggestion=function(t){var n=t.target.value;e.setState({userInput:n})},e.handleLongInfo=function(e,t){if(e.length>t){if(" "!==e.charAt(t-1)){var n=e.slice(t,e.length).search(" ");if(n<0){var a=e.length-t;a<10&&(n=a)}t+=n}e=e.slice(0,t),e+=" ..."}return e},e.newInput=!1,e.state={suggestions:[],userInput:""},e}return Object(l.a)(n,[{key:"componentDidUpdate",value:function(){this.newInput&&(this.apiCall(this.state.userInput),this.newInput=!1)}},{key:"render",value:function(){return Object(a.jsx)("header",{children:Object(a.jsxs)("div",{className:"flexContainer container",children:[this.renderForm(),this.renderNav()]})})}}]),n}(s.Component),k=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).updateFirebase=function(){e.dbRef.on("value",(function(t){var n=t.val(),a=[];for(var s in n){var o=n[s].book,r=n[s].completed;n[s].saved&&a.push([o,r,s])}e.setState({savedBooks:a})}))},e.addWindowEventListener=function(){window.addEventListener("resize",(function(){e.setState({windowInnerWidth:window.innerWidth})}))},e.handleRemoveBook=function(t){e.dbRef.child(t).remove(),e.state.indexOfDisplayedBook>=e.state.savedBooks.length-1&&e.setState({indexOfDisplayedBook:e.state.indexOfDisplayedBook-1})},e.handleClick=function(t){var n=e.state.indexOfDisplayedBook+t;n=e.indexLoop(n),e.setState({indexOfDisplayedBook:n})},e.indexLoop=function(t){return t<0?t=e.state.savedBooks.length+t:t>e.state.savedBooks.length-1&&(t-=e.state.savedBooks.length),t},e.displayBook=function(t,n,s,o,r){return Object(a.jsx)("div",{className:n,children:"displayedBook"===n?e.createLink(r,(function(){return Object(a.jsx)("img",{src:s,alt:o})})):Object(a.jsx)("img",{src:s,alt:o})},t)},e.createLink=function(e,t){return Object(a.jsx)(h.b,{to:"/mybookshelf/".concat(e),children:t()})},e.toggleDisplay=function(){e.setState({gridDisplay:!e.state.gridDisplay})},e.renderBookDisplay=function(t){return Object(a.jsxs)(s.Fragment,{children:[Object(a.jsxs)("div",{className:"dashboardContainer",children:[Object(a.jsx)("button",{className:"gridDisplayButton",onClick:function(){return e.toggleDisplay()},children:Object(a.jsx)("i",{className:"fas fa-grip-horizontal"})}),Object(a.jsx)("h3",{children:"".concat(e.completedCalculation(),"% Reading Completed!")})]}),e.state.gridDisplay?e.renderGridDisplay():e.renderCarousel(t)]})},e.renderGridDisplay=function(){return Object(a.jsx)("section",{className:"gridDisplay",children:Object(a.jsx)("div",{className:"bookShelfDisplay",children:e.state.savedBooks.map((function(t){var n=t[0].bookImg,s="Book cover for ".concat(t[0].title),o=t[2],r=t[0].title;return Object(a.jsxs)("div",{className:"displayedBook",children:[Object(a.jsx)(h.b,{to:"/mybookshelf/".concat(r),children:Object(a.jsx)("img",{src:n,alt:s})}),Object(a.jsx)("button",{onClick:function(){return e.handleRemoveBook(o)},className:"removeBook",children:"Remove"})]})}))})})},e.renderCarousel=function(t){t>e.state.savedBooks.length&&(t=e.state.savedBooks.length),t%2===0&&(t-=1);for(var n=e.state.indexOfDisplayedBook-Math.floor(t/2),s=[],o=0;o<t;o++)n=e.indexLoop(n),s.push(e.state.savedBooks[n]),n++;var r=e.state.savedBooks[e.state.indexOfDisplayedBook][2];return Object(a.jsxs)("section",{className:"carousel",children:[Object(a.jsxs)("div",{className:"bookShelfDisplay",children:[Object(a.jsx)("i",{className:"fas fa-chevron-left",onClick:function(){return e.handleClick(-1)}}),s.map((function(n,a){var s="";s=a===Math.floor(t/2)?"displayedBook":"shelvedBooks";var o=n[0].bookImg,r="Book cover for ".concat(n[0].title),c=n[2],i=n[0].title;return e.displayBook(c,s,o,r,i)})),Object(a.jsx)("i",{className:"fas fa-chevron-right",onClick:function(){return e.handleClick(1)}})]}),Object(a.jsx)("button",{onClick:function(){return e.handleRemoveBook(r)},className:"removeBook",children:"Remove"})]})},e.renderErrorMessage=function(){return Object(a.jsx)("h2",{className:"bookshelfEmptyMessage",children:"No saved books yet!"})},e.completedCalculation=function(){var t=0;e.state.savedBooks.forEach((function(e){e[1]&&t++}));var n=100*t/e.state.savedBooks.length;return n=Math.ceil(n)},e.getNumOfBooksToDisplayOnCarousel=function(){return e.state.windowInnerWidth>1250?9:e.state.windowInnerWidth>900?5:e.state.windowInnerWidth>800?3:1},e.dbRef=x.database().ref(),e.state={savedBooks:[],windowInnerWidth:1280,indexOfDisplayedBook:0,gridDisplay:!1},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.updateFirebase(),this.addWindowEventListener()}},{key:"componentWillUnmount",value:function(){this.dbRef.off()}},{key:"render",value:function(){var e;return e=this.state.gridDisplay?"gridBookshelf":"carouselBookshelf",Object(a.jsx)("div",{className:e,children:this.state.savedBooks.length?this.renderBookDisplay(this.getNumOfBooksToDisplayOnCarousel()):this.renderErrorMessage()})}}]),n}(s.Component),y=n(42),I=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){var e;return Object(i.a)(this,n),(e=t.call(this)).getDataFromFirebase=function(){e.dbRef.on("value",(function(t){var n=t.val();for(var a in n){if(n[a].book){if(n[a].book.title===e.props.match.params.book){var s=n[a].book;e.setState({bookToDisplay:s,firebaseIdOfDisplayedBook:a,completed:n[a].completed,saved:n[a].saved})}}else e.dbRef.child(a).remove();n[a].saved||e.dbRef.child(a).remove()}}))},e.handleRemoveBook=function(t){e.dbRef.child(t).remove(),e.setState({removed:!0,saved:!1})},e.handleAddBook=function(t){var n={book:t,completed:!1,saved:!0};e.dbRef.push(n),e.setState({removed:!1})},e.renderButton=function(){return e.state.removed||!e.state.saved?Object(a.jsx)("button",{onClick:function(){return e.handleAddBook(e.state.bookToDisplay)},className:"addBook",children:"Add to bookshelf"}):Object(a.jsx)("button",{onClick:function(){return e.handleRemoveBook(e.state.firebaseIdOfDisplayedBook)},className:"removeBook",children:"Remove book"})},e.renderCheckbox=function(){return e.state.saved?Object(a.jsxs)("div",{className:"checkbox",children:[Object(a.jsx)("i",{className:"fas fa-award"}),Object(a.jsx)("input",{checked:e.state.completed,onChange:function(){return e.handleCheckbox()},type:"checkbox",name:"completed",id:"completed"}),Object(a.jsx)("label",{htmlFor:"completed",children:"Completed Reading"})]}):null},e.renderExitButton=function(){return e.state.saved?Object(a.jsx)(h.b,{to:"/mybookshelf",children:Object(a.jsx)("button",{className:"exitButton",children:Object(a.jsx)("i",{className:"fas fa-times-circle"})})}):Object(a.jsx)(h.b,{to:"/search/".concat(e.state.bookToDisplay.searchInput),children:Object(a.jsx)("button",{className:"exitButton",children:Object(a.jsx)("i",{className:"fas fa-times-circle"})})})},e.renderInformation=function(t){return Object(a.jsxs)("div",{className:"detailsFlexContainer container",children:[e.renderExitButton(),Object(a.jsx)("div",{className:"imageContainer",children:Object(a.jsx)("img",{src:t.bookImg,alt:"Book cover for ".concat(t.title)})}),Object(a.jsxs)("div",{className:"description",children:[Object(a.jsx)("h2",{className:"bold",children:t.title}),Object(a.jsxs)("h3",{children:["By: ",Object(a.jsx)("span",{children:t.authors}),"  | Genre: ",Object(a.jsx)("span",{children:t.category})]}),Object(a.jsxs)("h4",{children:[Object(a.jsx)("i",{className:"fas fa-star"})," : ",Object(a.jsx)("span",{children:t.rating})]}),Object(a.jsxs)("h4",{children:["Published by: ",Object(a.jsx)("span",{children:t.publisher})," on: ",Object(a.jsx)("span",{children:t.publishedDate})]}),Object(a.jsxs)("h4",{className:"lastRow ",children:["Page count:",Object(a.jsx)("span",{children:t.pageCount})," | Language: ",Object(a.jsx)("span",{children:t.language})]}),Object(a.jsx)("h4",{children:Object(a.jsx)("span",{children:t.description})})]}),e.renderButton(),e.renderCheckbox()]})},e.handleCheckbox=function(){e.setState({completed:!e.state.completed})},e.dbRef=y.a.database().ref(),e.state={bookToDisplay:{},firebaseIdOfDisplayedBook:"",removed:!1,completed:!1,saved:!1},e}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.getDataFromFirebase()}},{key:"componentWillUnmount",value:function(){this.dbRef.off()}},{key:"componentDidUpdate",value:function(){this.dbRef.child(this.state.firebaseIdOfDisplayedBook).update({completed:this.state.completed})}},{key:"render",value:function(){return this.renderInformation(this.state.bookToDisplay)}}]),n}(s.Component),B=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(a.jsx)("footer",{children:Object(a.jsx)("p",{children:Object(a.jsx)("a",{href:"www.junocollege.com",children:"Juno College of Technology \xa92020"})})})}}]),n}(s.Component),N=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(a.jsx)(h.a,{children:Object(a.jsxs)("div",{className:"App",children:[Object(a.jsx)(O,{}),Object(a.jsx)(b.a,{exact:!0,path:"/book-club-reads/",component:v}),Object(a.jsx)(b.a,{exact:!0,path:"/search/:search",component:g}),Object(a.jsx)(b.a,{exact:!0,path:"/mybookshelf",component:k}),Object(a.jsx)(b.a,{path:"/mybookshelf/:book",component:I}),Object(a.jsx)(b.a,{path:"/moredetails/:book",component:I}),Object(a.jsx)(B,{})]})})}}]),n}(s.Component),C=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,75)).then((function(t){var n=t.getCLS,a=t.getFID,s=t.getFCP,o=t.getLCP,r=t.getTTFB;n(e),a(e),s(e),o(e),r(e)}))};c.a.render(Object(a.jsx)(o.a.StrictMode,{children:Object(a.jsx)(N,{})}),document.getElementById("root")),C()}},[[74,1,2]]]);
//# sourceMappingURL=main.284dc6bc.chunk.js.map