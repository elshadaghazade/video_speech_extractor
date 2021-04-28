(this["webpackJsonpfront-end"]=this["webpackJsonpfront-end"]||[]).push([[0],{15:function(t,e,n){},36:function(t,e,n){},37:function(t,e,n){},62:function(t,e,n){},63:function(t,e,n){"use strict";n.r(e);var c=n(0),a=n.n(c),s=n(29),i=n.n(s),r=(n(36),n(7)),o=n(6),l=n(2),d=(n(37),n(1));function j(t){return Object(d.jsxs)("header",{className:"flex text-center",children:[Object(d.jsx)("h1",{children:t.children}),Object(d.jsxs)("div",{style:{flex:1},children:[Object(d.jsx)(o.b,{className:"link",to:"/",children:"DASHBOARD"}),Object(d.jsx)(o.b,{className:"link",to:"/upload",children:"UPLOAD"}),Object(d.jsx)(o.b,{className:"link",to:"/transcripts",children:"TRANSCRIPTS"})]})]})}var u=n(9),h=n(10),p=n(12),b=n(11),O=n(18),v=n(31),f=n.n(v).a.create({baseURL:"/"}),x=function(t){Object(p.a)(n,t);var e=Object(b.a)(n);function n(){var t;return Object(u.a)(this,n),(t=e.call(this)).state={video:void 0},t}return Object(h.a)(n,[{key:"componentDidMount",value:function(){var t=this;f.get("/api/transcript/list/".concat(this.props.match.params.id)).then((function(e){var n=e.data;t.setState(Object(O.a)(Object(O.a)({},t.state),{},{video:n}))}))}},{key:"render",value:function(){var t=this;return void 0===this.state.video?Object(d.jsx)("h2",{children:"loading..."}):null===this.state.video?Object(d.jsx)("h2",{children:"in progress..."}):Object(d.jsxs)("div",{className:"flex flex-column",children:[Object(d.jsx)(o.b,{to:"/transcripts",children:"\xab Back to transcripts"}),Object(d.jsxs)("strong",{children:["file name: ",this.state.video.filename]}),Object(d.jsxs)("strong",{children:["file size: ",this.state.video.length," bytes"]}),Object(d.jsxs)("strong",{children:["uploaded at: ",this.state.video.uploadDate]}),Object(d.jsx)("a",{href:"/api/transcript/list/".concat(this.state.video._id,"/download/"),children:"Download transcript"}),this.state.video.transcript.map((function(t,e){return Object(d.jsxs)("div",{className:"transcript-item flex flex-column",children:[Object(d.jsxs)("label",{htmlFor:"inp-".concat(e),children:[Math.round(t.seconds)," seconds"]}),Object(d.jsx)("textarea",{id:"inp-".concat(e),onChange:function(e){t.speech=e.target.value},defaultValue:t.speech})]},"transcript-item-inp-".concat(e))})),Object(d.jsx)("button",{className:"btn",onClick:function(){f.post("/api/transcript/list/".concat(t.state.video._id),t.state.video.transcript).then((function(e){t.props.setVid(null)}))},children:"SAVE"})]})}}]),n}(c.Component),m=(n(15),n(62),function(t){Object(p.a)(n,t);var e=Object(b.a)(n);function n(){var t;return Object(u.a)(this,n),(t=e.call(this)).state={transcripts:[],vid:null},t}return Object(h.a)(n,[{key:"loadTranscripts",value:function(){var t=this;f.get("/api/transcript/list").then((function(e){var n=e.data;t.setState({transcripts:n}),f.get("/api/transcript_generator/?fs=videos").then((function(e){var n=e.data;t.setState({transcripts:t.state.transcripts.concat(n)})}))}))}},{key:"componentWillUnmount",value:function(){clearInterval(this.interval)}},{key:"componentDidMount",value:function(){var t=this;this.loadTranscripts(),this.interval=setInterval((function(){return t.loadTranscripts()}),5e3)}},{key:"render",value:function(){return this.state.transcripts&&this.state.transcripts.length?Object(d.jsx)("div",{className:"flex flex-column",children:this.state.transcripts.map((function(t,e){return Object(d.jsxs)(o.b,{to:"/transcripts/".concat(t.video_id||t._id),className:"btn",children:[Object(d.jsx)("div",{children:t.filename}),Object(d.jsxs)("div",{children:[t.length," bytes"]}),t.chunkSize?Object(d.jsx)("div",{children:"in progress..."}):null]},"transcript-item-".concat(e))}))}):Object(d.jsx)("div",{className:"flex flex-column",children:Object(d.jsx)("h2",{children:"THERE IS NO TRANSCRIPT YET"})})}}]),n}(c.Component));var g=function(t){var e=Object(c.useState)([]),n=Object(r.a)(e,2),a=n[0],s=n[1],i=Object(c.useState)(0),o=Object(r.a)(i,2),j=o[0],u=o[1],h=Object(c.useState)(null),p=Object(r.a)(h,2),b=p[0],O=p[1];return b?Object(d.jsx)(l.a,{to:"/transcripts"}):Object(d.jsxs)("div",{className:"flex flex-column",children:[Object(d.jsx)("input",{className:"btn",onChange:function(t){s(t.target.files),u(0)},type:"file",accept:"video/mp4,.mp4,video/quicktime,.mov,video/x-msvideo,.avi"}),j?Object(d.jsxs)("div",{children:["uploading ",j,"%"]}):Object(d.jsxs)("button",{onClick:function(){var t=new FormData;t.append("filename",a[0]),f.post("/api/transcript_generator/?fs=videos",t,{headers:{"Content-Type":"multipart/form-data"},onUploadProgress:function(t){u(Math.round(100*t.loaded/t.total))}}).then((function(t){O(t.data)}))},children:["UPLOAD ",j,"%"]})]})};var S=function(){var t=Object(c.useState)(0),e=Object(r.a)(t,2),n=(e[0],e[1]),a=Object(c.useState)(null),s=Object(r.a)(a,2),i=(s[0],s[1]);return f("/api/transcript/list").then((function(t){var e=t.data;n(e instanceof Array&&e.length||0)})).catch((function(t){return null})),Object(d.jsxs)(o.a,{children:[Object(d.jsx)("div",{className:"app"}),Object(d.jsx)(j,{setPage:function(t){return i(t)},children:"TRANSCRIPT EXTRACTOR - LIST"}),Object(d.jsx)("div",{className:"container flex",children:Object(d.jsxs)(l.d,{children:[Object(d.jsx)(l.b,{path:"/upload",children:Object(d.jsx)(g,{})}),Object(d.jsx)(l.b,{path:"/transcripts",exact:!0,children:Object(d.jsx)(m,{})}),Object(d.jsx)(l.b,{path:"/transcripts/:id",component:x})]})})]})},N=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,64)).then((function(e){var n=e.getCLS,c=e.getFID,a=e.getFCP,s=e.getLCP,i=e.getTTFB;n(t),c(t),a(t),s(t),i(t)}))};i.a.render(Object(d.jsx)(a.a.StrictMode,{children:Object(d.jsx)(S,{})}),document.getElementById("root")),N()}},[[63,1,2]]]);