// notion-proxy Cloudflare Worker
// 브라우저 → 이 Worker → 노션 API (CORS 우회 + 토큰 숨김)

// ===== fflate (zip 압축/해제) - 주간업무 HWPX(한글) 생성용, npm 없이 소스 그대로 인라인 =====
// https://github.com/101arrowz/fflate (MIT License)
!function(f){typeof module!='undefined'&&typeof exports=='object'?module.exports=f():typeof define!='undefined'&&define.amd?define(f):(typeof self!='undefined'?self:this).fflate=f()}(function(){var _e={};"use strict";var t=(typeof module!='undefined'&&typeof exports=='object'?function(_f){"use strict";var e,t=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{e=require("worker_threads").Worker}catch(e){}exports.default=e?function(r,n,o,a,s){var u=!1,i=new e(r+t,{eval:!0}).on("error",(function(e){return s(e,null)})).on("message",(function(e){return s(null,e)})).on("exit",(function(e){e&&!u&&s(Error("exited with code "+e),null)}));return i.postMessage(o,a),i.terminate=function(){return u=!0,e.prototype.terminate.call(i)},i}:function(e,t,r,n,o){setImmediate((function(){return o(Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)}));var a=function(){};return{terminate:a,postMessage:a}};return _f}:function(_f){"use strict";var e={};_f.default=function(r,t,s,a,n){var o=new Worker(e[t]||(e[t]=URL.createObjectURL(new Blob([r+';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'],{type:"text/javascript"}))));return o.onmessage=function(e){var r=e.data,t=r.$e$;if(t){var s=Error(t[0]);s.code=t[1],s.stack=t[2],n(s,null)}else n(null,r)},o.postMessage(s,a),o};return _f})({}),n=Uint8Array,r=Uint16Array,e=Int32Array,i=new n([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),o=new n([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new n([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,n){for(var i=new r(31),o=0;o<31;++o)i[o]=n+=1<<t[o-1];var s=new e(i[30]);for(o=1;o<30;++o)for(var a=i[o];a<i[o+1];++a)s[a]=a-i[o]<<5|o;return{b:i,r:s}},u=a(i,2),h=u.b,f=u.r;h[28]=258,f[258]=28;for(var l=a(o,0),c=l.b,p=l.r,v=new r(32768),d=0;d<32768;++d){var g=(43690&d)>>1|(21845&d)<<1;v[d]=((65280&(g=(61680&(g=(52428&g)>>2|(13107&g)<<2))>>4|(3855&g)<<4))>>8|(255&g)<<8)>>1}var y=function(t,n,e){for(var i=t.length,o=0,s=new r(n);o<i;++o)t[o]&&++s[t[o]-1];var a,u=new r(n);for(o=1;o<n;++o)u[o]=u[o-1]+s[o-1]<<1;if(e){a=new r(1<<n);var h=15-n;for(o=0;o<i;++o)if(t[o])for(var f=o<<4|t[o],l=n-t[o],c=u[t[o]-1]++<<l,p=c|(1<<l)-1;c<=p;++c)a[v[c]>>h]=f}else for(a=new r(i),o=0;o<i;++o)t[o]&&(a[o]=v[u[t[o]-1]++]>>15-t[o]);return a},m=new n(288);for(d=0;d<144;++d)m[d]=8;for(d=144;d<256;++d)m[d]=9;for(d=256;d<280;++d)m[d]=7;for(d=280;d<288;++d)m[d]=8;var b=new n(32);for(d=0;d<32;++d)b[d]=5;var w=y(m,9,0),x=y(m,9,1),z=y(b,5,0),k=y(b,5,1),M=function(t){for(var n=t[0],r=1;r<t.length;++r)t[r]>n&&(n=t[r]);return n},S=function(t,n,r){var e=n/8|0;return(t[e]|t[e+1]<<8)>>(7&n)&r},A=function(t,n){var r=n/8|0;return(t[r]|t[r+1]<<8|t[r+2]<<16)>>(7&n)},T=function(t){return(t+7)/8|0},D=function(t,r,e){return(null==r||r<0)&&(r=0),(null==e||e>t.length)&&(e=t.length),new n(t.subarray(r,e))};_e.FlateErrorCode={UnexpectedEOF:0,InvalidBlockType:1,InvalidLengthLiteral:2,InvalidDistance:3,StreamFinished:4,NoStreamHandler:5,InvalidHeader:6,NoCallback:7,InvalidUTF8:8,ExtraFieldTooLong:9,InvalidDate:10,FilenameTooLong:11,StreamFinishing:12,InvalidZipData:13,UnknownCompressionMethod:14};var C=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],I=function(t,n,r){var e=Error(n||C[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,I),!r)throw e;return e},U=function(t,r,e,a){var u=t.length,f=a?a.length:0;if(!u||r.f&&!r.l)return e||new n(0);var l=!e,p=l||2!=r.i,v=r.i;l&&(e=new n(3*u));var d=function(t){var r=e.length;if(t>r){var i=new n(Math.max(2*r,t));i.set(e),e=i}},g=r.f||0,m=r.p||0,b=r.b||0,w=r.l,z=r.d,C=r.m,U=r.n,F=8*u;do{if(!w){g=S(t,m,1);var E=S(t,m+1,3);if(m+=3,!E){var Z=t[(J=T(m)+4)-4]|t[J-3]<<8,q=J+Z;if(q>u){v&&I(0);break}p&&d(b+Z),e.set(t.subarray(J,q),b),r.b=b+=Z,r.p=m=8*q,r.f=g;continue}if(1==E)w=x,z=k,C=9,U=5;else if(2==E){var O=S(t,m,31)+257,G=S(t,m+10,15)+4,L=O+S(t,m+5,31)+1;m+=14;for(var H=new n(L),j=new n(19),N=0;N<G;++N)j[s[N]]=S(t,m+3*N,7);m+=3*G;var P=M(j),B=(1<<P)-1,Y=y(j,P,1);for(N=0;N<L;){var J,K=Y[S(t,m,B)];if(m+=15&K,(J=K>>4)<16)H[N++]=J;else{var Q=0,R=0;for(16==J?(R=3+S(t,m,3),m+=2,Q=H[N-1]):17==J?(R=3+S(t,m,7),m+=3):18==J&&(R=11+S(t,m,127),m+=7);R--;)H[N++]=Q}}var V=H.subarray(0,O),W=H.subarray(O);C=M(V),U=M(W),w=y(V,C,1),z=y(W,U,1)}else I(1);if(m>F){v&&I(0);break}}p&&d(b+131072);for(var X=(1<<C)-1,$=(1<<U)-1,_=m;;_=m){var tt=(Q=w[A(t,m)&X])>>4;if((m+=15&Q)>F){v&&I(0);break}if(Q||I(2),tt<256)e[b++]=tt;else{if(256==tt){_=m,w=null;break}var nt=tt-254;tt>264&&(nt=S(t,m,(1<<(it=i[N=tt-257]))-1)+h[N],m+=it);var rt=z[A(t,m)&$],et=rt>>4;if(rt||I(3),m+=15&rt,W=c[et],et>3){var it=o[et];W+=A(t,m)&(1<<it)-1,m+=it}if(m>F){v&&I(0);break}p&&d(b+131072);var ot=b+nt;if(b<W){var st=f-W,at=Math.min(W,ot);for(st+b<0&&I(3);b<at;++b)e[b]=a[st+b]}for(;b<ot;++b)e[b]=e[b-W]}}r.l=w,r.p=_,r.b=b,r.f=g,w&&(g=1,r.m=C,r.d=z,r.n=U)}while(!g);return b!=e.length&&l?D(e,0,b):e.subarray(0,b)},F=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>8},E=function(t,n,r){var e=n/8|0;t[e]|=r<<=7&n,t[e+1]|=r>>8,t[e+2]|=r>>16},Z=function(t,e){for(var i=[],o=0;o<t.length;++o)t[o]&&i.push({s:o,f:t[o]});var s=i.length,a=i.slice();if(!s)return{t:N,l:0};if(1==s){var u=new n(i[0].s+1);return u[i[0].s]=1,{t:u,l:1}}i.sort((function(t,n){return t.f-n.f})),i.push({s:-1,f:25001});var h=i[0],f=i[1],l=0,c=1,p=2;for(i[0]={s:-1,f:h.f+f.f,l:h,r:f};c!=s-1;)h=i[i[l].f<i[p].f?l++:p++],f=i[l!=c&&i[l].f<i[p].f?l++:p++],i[c++]={s:-1,f:h.f+f.f,l:h,r:f};var v=a[0].s;for(o=1;o<s;++o)a[o].s>v&&(v=a[o].s);var d=new r(v+1),g=q(i[c-1],d,0);if(g>e){o=0;var y=0,m=g-e,b=1<<m;for(a.sort((function(t,n){return d[n.s]-d[t.s]||t.f-n.f}));o<s;++o){var w=a[o].s;if(!(d[w]>e))break;y+=b-(1<<g-d[w]),d[w]=e}for(y>>=m;y>0;){var x=a[o].s;d[x]<e?y-=1<<e-d[x]++-1:++o}for(;o>=0&&y;--o){var z=a[o].s;d[z]==e&&(--d[z],++y)}g=e}return{t:new n(d),l:g}},q=function(t,n,r){return-1==t.s?Math.max(q(t.l,n,r+1),q(t.r,n,r+1)):n[t.s]=r},O=function(t){for(var n=t.length;n&&!t[--n];);for(var e=new r(++n),i=0,o=t[0],s=1,a=function(t){e[i++]=t},u=1;u<=n;++u)if(t[u]==o&&u!=n)++s;else{if(!o&&s>2){for(;s>138;s-=138)a(32754);s>2&&(a(s>10?s-11<<5|28690:s-3<<5|12305),s=0)}else if(s>3){for(a(o),--s;s>6;s-=6)a(8304);s>2&&(a(s-3<<5|8208),s=0)}for(;s--;)a(o);s=1,o=t[u]}return{c:e.subarray(0,i),n:n}},G=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},L=function(t,n,r){var e=r.length,i=T(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var o=0;o<e;++o)t[i+o+4]=r[o];return 8*(i+4+e)},H=function(t,n,e,a,u,h,f,l,c,p,v){F(n,v++,e),++u[256];for(var d=Z(u,15),g=d.t,x=d.l,k=Z(h,15),M=k.t,S=k.l,A=O(g),T=A.c,D=A.n,C=O(M),I=C.c,U=C.n,q=new r(19),H=0;H<T.length;++H)++q[31&T[H]];for(H=0;H<I.length;++H)++q[31&I[H]];for(var j=Z(q,7),N=j.t,P=j.l,B=19;B>4&&!N[s[B-1]];--B);var Y,J,K,Q,R=p+5<<3,V=G(u,m)+G(h,b)+f,W=G(u,g)+G(h,M)+f+14+3*B+G(q,N)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&R<=V&&R<=W)return L(n,v,t.subarray(c,c+p));if(F(n,v,1+(W<V)),v+=2,W<V){Y=y(g,x,0),J=g,K=y(M,S,0),Q=M;var X=y(N,P,0);for(F(n,v,D-257),F(n,v+5,U-1),F(n,v+10,B-4),v+=14,H=0;H<B;++H)F(n,v+3*H,N[s[H]]);v+=3*B;for(var $=[T,I],_=0;_<2;++_){var tt=$[_];for(H=0;H<tt.length;++H)F(n,v,X[rt=31&tt[H]]),v+=N[rt],rt>15&&(F(n,v,tt[H]>>5&127),v+=tt[H]>>12)}}else Y=w,J=m,K=z,Q=b;for(H=0;H<l;++H){var nt=a[H];if(nt>255){var rt;E(n,v,Y[257+(rt=nt>>18&31)]),v+=J[rt+257],rt>7&&(F(n,v,nt>>23&31),v+=i[rt]);var et=31&nt;E(n,v,K[et]),v+=Q[et],et>3&&(E(n,v,nt>>5&8191),v+=o[et])}else E(n,v,Y[nt]),v+=J[nt]}return E(n,v,Y[256]),v+J[256]},j=new e([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),N=new n(0),P=function(t,s,a,u,h,l){var c=l.z||t.length,v=new n(u+c+5*(1+Math.ceil(c/7e3))+h),d=v.subarray(u,v.length-h),g=l.l,y=7&(l.r||0);if(s){y&&(d[0]=l.r>>3);for(var m=j[s-1],b=m>>13,w=8191&m,x=(1<<a)-1,z=l.p||new r(32768),k=l.h||new r(x+1),M=Math.ceil(a/3),S=2*M,A=function(n){return(t[n]^t[n+1]<<M^t[n+2]<<S)&x},C=new e(25e3),I=new r(288),U=new r(32),F=0,E=0,Z=l.i||0,q=0,O=l.w||0,G=0;Z+2<c;++Z){var N=A(Z),P=32767&Z,B=k[N];if(z[P]=B,k[N]=P,O<=Z){var Y=c-Z;if((F>7e3||q>24576)&&(Y>423||!g)){y=H(t,d,0,C,I,U,E,q,G,Z-G,y),q=F=E=0,G=Z;for(var J=0;J<286;++J)I[J]=0;for(J=0;J<30;++J)U[J]=0}var K=2,Q=0,R=w,V=P-B&32767;if(Y>2&&N==A(Z-V))for(var W=Math.min(b,Y)-1,X=Math.min(32767,Z),$=Math.min(258,Y);V<=X&&--R&&P!=B;){if(t[Z+K]==t[Z+K-V]){for(var _=0;_<$&&t[Z+_]==t[Z+_-V];++_);if(_>K){if(K=_,Q=V,_>W)break;var tt=Math.min(V,_-2),nt=0;for(J=0;J<tt;++J){var rt=Z-V+J&32767,et=rt-z[rt]&32767;et>nt&&(nt=et,B=rt)}}}V+=(P=B)-(B=z[P])&32767}if(Q){C[q++]=268435456|f[K]<<18|p[Q];var it=31&f[K],ot=31&p[Q];E+=i[it]+o[ot],++I[257+it],++U[ot],O=Z+K,++F}else C[q++]=t[Z],++I[t[Z]]}}for(Z=Math.max(Z,O);Z<c;++Z)C[q++]=t[Z],++I[t[Z]];y=H(t,d,g,C,I,U,E,q,G,Z-G,y),g||(l.r=7&y|d[y/8|0]<<3,y-=7,l.h=k,l.p=z,l.i=Z,l.w=O)}else{for(Z=l.w||0;Z<c+g;Z+=65535){var st=Z+65535;st>=c&&(d[y/8|0]=g,st=c),y=L(d,y+1,t.subarray(Z,st))}l.i=c}return D(v,0,u+T(y)+h)},B=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),Y=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=B[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}},J=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,o=0|r.length,s=0;s!=o;){for(var a=Math.min(s+2655,o);s<a;++s)i+=e+=r[s];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},K=function(t,r,e,i,o){if(!o&&(o={l:1},r.dictionary)){var s=r.dictionary.subarray(-32768),a=new n(s.length+t.length);a.set(s),a.set(t,s.length),t=a,o.w=s.length}return P(t,null==r.level?6:r.level,null==r.mem?o.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):20:12+r.mem,e,i,o)},Q=function(t,n){var r={};for(var e in t)r[e]=t[e];for(var e in n)r[e]=n[e];return r},R=function(t,n,r){for(var e=t(),i=""+t,o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),s=0;s<e.length;++s){var a=e[s],u=o[s];if("function"==typeof a){n+=";"+u+"=";var h=""+a;if(a.prototype)if(-1!=h.indexOf("[native code]")){var f=h.indexOf(" ",8)+1;n+=h.slice(f,h.indexOf("(",f))}else for(var l in n+=h,a.prototype)n+=";"+u+".prototype."+l+"="+a.prototype[l];else n+=h}else r[u]=a}return n},V=[],W=function(t){var n=[];for(var r in t)t[r].buffer&&n.push((t[r]=new t[r].constructor(t[r])).buffer);return n},X=function(n,r,e,i){if(!V[e]){for(var o="",s={},a=n.length-1,u=0;u<a;++u)o=R(n[u],o,s);V[e]={c:R(n[a],o,s),e:s}}var h=Q({},V[e].e);return(0,t.default)(V[e].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+r+"}",e,h,W(h),i)},$=function(){return[n,r,e,i,o,s,h,c,x,k,v,C,y,M,S,A,T,D,I,U,Tt,it,ot]},_=function(){return[n,r,e,i,o,s,f,p,w,m,z,b,v,j,N,y,F,E,Z,q,O,G,L,H,T,D,P,K,kt,it]},tt=function(){return[pt,gt,ct,Y,B]},nt=function(){return[vt,dt]},rt=function(){return[yt,ct,J]},et=function(){return[mt]},it=function(t){return postMessage(t,[t.buffer])},ot=function(t){return t&&{out:t.size&&new n(t.size),dictionary:t.dictionary}},st=function(t,n,r,e,i,o){var s=X(r,e,i,(function(t,n){s.terminate(),o(t,n)}));return s.postMessage([t,n],n.consume?[t.buffer]:[]),function(){s.terminate()}},at=function(t){return t.ondata=function(t,n){return postMessage([t,n],[t.buffer])},function(n){n.data.length?(t.push(n.data[0],n.data[1]),postMessage([n.data[0].length])):t.flush()}},ut=function(t,n,r,e,i,o,s){var a,u=X(t,e,i,(function(t,r){t?(u.terminate(),n.ondata.call(n,t)):Array.isArray(r)?1==r.length?(n.queuedSize-=r[0],n.ondrain&&n.ondrain(r[0])):(r[1]&&u.terminate(),n.ondata.call(n,t,r[0],r[1])):s(r)}));u.postMessage(r),n.queuedSize=0,n.push=function(t,r){n.ondata||I(5),a&&n.ondata(I(4,0,1),null,!!r),n.queuedSize+=t.length,u.postMessage([t,a=r],[t.buffer])},n.terminate=function(){u.terminate()},o&&(n.flush=function(){u.postMessage([])})},ht=function(t,n){return t[n]|t[n+1]<<8},ft=function(t,n){return(t[n]|t[n+1]<<8|t[n+2]<<16|t[n+3]<<24)>>>0},lt=function(t,n){return ft(t,n)+4294967296*ft(t,n+4)},ct=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},pt=function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&ct(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}},vt=function(t){31==t[0]&&139==t[1]&&8==t[2]||I(6,"invalid gzip data");var n=t[3],r=10;4&n&&(r+=2+(t[10]|t[11]<<8));for(var e=(n>>3&1)+(n>>4&1);e>0;e-=!t[r++]);return r+(2&n)},dt=function(t){var n=t.length;return(t[n-4]|t[n-3]<<8|t[n-2]<<16|t[n-1]<<24)>>>0},gt=function(t){return 10+(t.filename?t.filename.length+1:0)},yt=function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=J();i.p(n.dictionary),ct(t,2,i.d())}},mt=function(t,n){return(8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31)&&I(6,"invalid zlib data"),(t[1]>>5&1)==+!n&&I(6,"invalid zlib data: "+(32&t[1]?"need":"unexpected")+" dictionary"),2+(t[1]>>3&4)};function bt(t,n){return"function"==typeof t&&(n=t,t={}),this.ondata=n,t}var wt=function(){function t(t,r){if("function"==typeof t&&(r=t,t={}),this.ondata=r,this.o=t||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new n(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return t.prototype.p=function(t,n){this.ondata(K(t,this.o,0,0,this.s),n)},t.prototype.push=function(t,r){this.ondata||I(5),this.s.l&&I(4);var e=t.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new n(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var o=this.b.length-this.s.z;this.b.set(t.subarray(0,o),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(t.subarray(o),32768),this.s.z=t.length-o+32768,this.s.i=32766,this.s.w=32768}else this.b.set(t,this.s.z),this.s.z+=t.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},t.prototype.flush=function(){this.ondata||I(5),this.s.l&&I(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},t}();_e.Deflate=wt;var xt=function(){return function(t,n){ut([_,function(){return[at,wt]}],this,bt.call(this,t,n),(function(t){var n=new wt(t.data);onmessage=at(n)}),6,1)}}();function zt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_],(function(t){return it(kt(t.data[0],t.data[1]))}),0,r)}function kt(t,n){return K(t,n||{},0,0)}_e.AsyncDeflate=xt,_e.deflate=zt,_e.deflateSync=kt;var Mt=function(){function t(t,r){"function"==typeof t&&(r=t,t={}),this.ondata=r;var e=t&&t.dictionary&&t.dictionary.subarray(-32768);this.s={i:0,b:e?e.length:0},this.o=new n(32768),this.p=new n(0),e&&this.o.set(e)}return t.prototype.e=function(t){if(this.ondata||I(5),this.d&&I(4),this.p.length){if(t.length){var r=new n(this.p.length+t.length);r.set(this.p),r.set(t,this.p.length),this.p=r}}else this.p=t},t.prototype.c=function(t){this.s.i=+(this.d=t||!1);var n=this.s.b,r=U(this.p,this.s,this.o);this.ondata(D(r,n,this.s.b),this.d),this.o=D(r,this.s.b-32768),this.s.b=this.o.length,this.p=D(this.p,this.s.p/8|0),this.s.p&=7},t.prototype.push=function(t,n){this.e(t),this.c(n)},t}();_e.Inflate=Mt;var St=function(){return function(t,n){ut([$,function(){return[at,Mt]}],this,bt.call(this,t,n),(function(t){var n=new Mt(t.data);onmessage=at(n)}),7,0)}}();function At(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$],(function(t){return it(Tt(t.data[0],ot(t.data[1])))}),1,r)}function Tt(t,n){return U(t,{i:2},n&&n.out,n&&n.dictionary)}_e.AsyncInflate=St,_e.inflate=At,_e.inflateSync=Tt;var Dt=function(){function t(t,n){this.c=Y(),this.l=0,this.v=1,wt.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),this.l+=t.length,wt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=K(t,this.o,this.v&&gt(this.o),n&&8,this.s);this.v&&(pt(r,this.o),this.v=0),n&&(ct(r,r.length-8,this.c.d()),ct(r,r.length-4,this.l)),this.ondata(r,n)},t.prototype.flush=function(){wt.prototype.flush.call(this)},t}();_e.Gzip=Dt,_e.Compress=Dt;var Ct=function(){return function(t,n){ut([_,tt,function(){return[at,wt,Dt]}],this,bt.call(this,t,n),(function(t){var n=new Dt(t.data);onmessage=at(n)}),8,1)}}();function It(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_,tt,function(){return[Ut]}],(function(t){return it(Ut(t.data[0],t.data[1]))}),2,r)}function Ut(t,n){n||(n={});var r=Y(),e=t.length;r.p(t);var i=K(t,n,gt(n),8),o=i.length;return pt(i,n),ct(i,o-8,r.d()),ct(i,o-4,e),i}_e.AsyncGzip=Ct,_e.AsyncCompress=Ct,_e.gzip=It,_e.compress=It,_e.gzipSync=Ut,_e.compressSync=Ut;var Ft=function(){function t(t,n){this.v=1,this.r=0,Mt.call(this,t,n)}return t.prototype.push=function(t,r){if(Mt.prototype.e.call(this,t),this.r+=t.length,this.v){var e=this.p.subarray(this.v-1),i=e.length>3?vt(e):4;if(i>e.length){if(!r)return}else this.v>1&&this.onmember&&this.onmember(this.r-e.length);this.p=e.subarray(i),this.v=0}Mt.prototype.c.call(this,r),!this.s.f||this.s.l||r||(this.v=T(this.s.p)+9,this.s={i:0},this.o=new n(0),this.push(new n(0),r))},t}();_e.Gunzip=Ft;var Et=function(){return function(t,n){var r=this;ut([$,nt,function(){return[at,Mt,Ft]}],this,bt.call(this,t,n),(function(t){var n=new Ft(t.data);n.onmember=function(t){return postMessage(t)},onmessage=at(n)}),9,0,(function(t){return r.onmember&&r.onmember(t)}))}}();function Zt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$,nt,function(){return[qt]}],(function(t){return it(qt(t.data[0],t.data[1]))}),3,r)}function qt(t,r){var e=vt(t);return e+8>t.length&&I(6,"invalid gzip data"),U(t.subarray(e,-8),{i:2},r&&r.out||new n(dt(t)),r&&r.dictionary)}_e.AsyncGunzip=Et,_e.gunzip=Zt,_e.gunzipSync=qt;var Ot=function(){function t(t,n){this.c=J(),this.v=1,wt.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),wt.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=K(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(yt(r,this.o),this.v=0),n&&ct(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){wt.prototype.flush.call(this)},t}();_e.Zlib=Ot;var Gt=function(){return function(t,n){ut([_,rt,function(){return[at,wt,Ot]}],this,bt.call(this,t,n),(function(t){var n=new Ot(t.data);onmessage=at(n)}),10,1)}}();function Lt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[_,rt,function(){return[Ht]}],(function(t){return it(Ht(t.data[0],t.data[1]))}),4,r)}function Ht(t,n){n||(n={});var r=J();r.p(t);var e=K(t,n,n.dictionary?6:2,4);return yt(e,n),ct(e,e.length-4,r.d()),e}_e.AsyncZlib=Gt,_e.zlib=Lt,_e.zlibSync=Ht;var jt=function(){function t(t,n){Mt.call(this,t,n),this.v=t&&t.dictionary?2:1}return t.prototype.push=function(t,n){if(Mt.prototype.e.call(this,t),this.v){if(this.p.length<6&&!n)return;this.p=this.p.subarray(mt(this.p,this.v-1)),this.v=0}n&&(this.p.length<4&&I(6,"invalid zlib data"),this.p=this.p.subarray(0,-4)),Mt.prototype.c.call(this,n)},t}();_e.Unzlib=jt;var Nt=function(){return function(t,n){ut([$,et,function(){return[at,Mt,jt]}],this,bt.call(this,t,n),(function(t){var n=new jt(t.data);onmessage=at(n)}),11,0)}}();function Pt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),st(t,n,[$,et,function(){return[Bt]}],(function(t){return it(Bt(t.data[0],ot(t.data[1])))}),5,r)}function Bt(t,n){return U(t.subarray(mt(t,n&&n.dictionary),-4),{i:2},n&&n.out,n&&n.dictionary)}_e.AsyncUnzlib=Nt,_e.unzlib=Pt,_e.unzlibSync=Bt;var Yt=function(){function t(t,n){this.o=bt.call(this,t,n)||{},this.G=Ft,this.I=Mt,this.Z=jt}return t.prototype.i=function(){var t=this;this.s.ondata=function(n,r){t.ondata(n,r)}},t.prototype.push=function(t,r){if(this.ondata||I(5),this.s)this.s.push(t,r);else{if(this.p&&this.p.length){var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length)}else this.p=t;this.p.length>2&&(this.s=31==this.p[0]&&139==this.p[1]&&8==this.p[2]?new this.G(this.o):8!=(15&this.p[0])||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?new this.I(this.o):new this.Z(this.o),this.i(),this.s.push(this.p,r),this.p=null)}},t}();_e.Decompress=Yt;var Jt=function(){function t(t,n){Yt.call(this,t,n),this.queuedSize=0,this.G=Et,this.I=St,this.Z=Nt}return t.prototype.i=function(){var t=this;this.s.ondata=function(n,r,e){t.ondata(n,r,e)},this.s.ondrain=function(n){t.queuedSize-=n,t.ondrain&&t.ondrain(n)}},t.prototype.push=function(t,n){this.queuedSize+=t.length,Yt.prototype.push.call(this,t,n)},t}();function Kt(t,n,r){return r||(r=n,n={}),"function"!=typeof r&&I(7),31==t[0]&&139==t[1]&&8==t[2]?Zt(t,n,r):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?At(t,n,r):Pt(t,n,r)}function Qt(t,n){return 31==t[0]&&139==t[1]&&8==t[2]?qt(t,n):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?Tt(t,n):Bt(t,n)}_e.AsyncDecompress=Jt,_e.decompress=Kt,_e.decompressSync=Qt;var Rt=function(t,r,e,i){for(var o in t){var s=t[o],a=r+o,u=i;Array.isArray(s)&&(u=Q(i,s[1]),s=s[0]),s instanceof n?e[a]=[s,u]:(e[a+="/"]=[new n(0),u],Rt(s,a,e,i))}},Vt="undefined"!=typeof TextEncoder&&new TextEncoder,Wt="undefined"!=typeof TextDecoder&&new TextDecoder,Xt=0;try{Wt.decode(N,{stream:!0}),Xt=1}catch(t){}var $t=function(t){for(var n="",r=0;;){var e=t[r++],i=(e>127)+(e>223)+(e>239);if(r+i>t.length)return{s:n,r:D(t,r-1)};i?3==i?(e=((15&e)<<18|(63&t[r++])<<12|(63&t[r++])<<6|63&t[r++])-65536,n+=String.fromCharCode(55296|e>>10,56320|1023&e)):n+=String.fromCharCode(1&i?(31&e)<<6|63&t[r++]:(15&e)<<12|(63&t[r++])<<6|63&t[r++]):n+=String.fromCharCode(e)}},_t=function(){function t(t){this.ondata=t,Xt?this.t=new TextDecoder:this.p=N}return t.prototype.push=function(t,r){if(this.ondata||I(5),r=!!r,this.t)return this.ondata(this.t.decode(t,{stream:!0}),r),void(r&&(this.t.decode().length&&I(8),this.t=null));this.p||I(4);var e=new n(this.p.length+t.length);e.set(this.p),e.set(t,this.p.length);var i=$t(e),o=i.s,s=i.r;r?(s.length&&I(8),this.p=null):this.p=s,this.ondata(o,r)},t}();_e.DecodeUTF8=_t;var tn=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||I(5),this.d&&I(4),this.ondata(nn(t),this.d=n||!1)},t}();function nn(t,r){if(r){for(var e=new n(t.length),i=0;i<t.length;++i)e[i]=t.charCodeAt(i);return e}if(Vt)return Vt.encode(t);var o=t.length,s=new n(t.length+(t.length>>1)),a=0,u=function(t){s[a++]=t};for(i=0;i<o;++i){if(a+5>s.length){var h=new n(a+8+(o-i<<1));h.set(s),s=h}var f=t.charCodeAt(i);f<128||r?u(f):f<2048?(u(192|f>>6),u(128|63&f)):f>55295&&f<57344?(u(240|(f=65536+(1047552&f)|1023&t.charCodeAt(++i))>>18),u(128|f>>12&63),u(128|f>>6&63),u(128|63&f)):(u(224|f>>12),u(128|f>>6&63),u(128|63&f))}return D(s,0,a)}function rn(t,n){if(n){for(var r="",e=0;e<t.length;e+=16384)r+=String.fromCharCode.apply(null,t.subarray(e,e+16384));return r}if(Wt)return Wt.decode(t);var i=$t(t),o=i.s;return(r=i.r).length&&I(8),o}_e.EncodeUTF8=tn,_e.strToU8=nn,_e.strFromU8=rn;var en=function(t){return 1==t?3:t<6?2:9==t?1:0},on=function(t,n){return n+30+ht(t,n+26)+ht(t,n+28)},sn=function(t,n,r){var e=ht(t,n+28),i=rn(t.subarray(n+46,n+46+e),!(2048&ht(t,n+8))),o=n+46+e,s=ft(t,n+20),a=r&&4294967295==s?an(t,o):[s,ft(t,n+24),ft(t,n+42)],u=a[0],h=a[1],f=a[2];return[ht(t,n+10),u,h,i,o+ht(t,n+30)+ht(t,n+32),f]},an=function(t,n){for(;1!=ht(t,n);n+=4+ht(t,n+2));return[lt(t,n+12),lt(t,n+4),lt(t,n+20)]},un=function(t){var n=0;if(t)for(var r in t){var e=t[r].length;e>65535&&I(9),n+=e+4}return n},hn=function(t,n,r,e,i,o,s,a){var u=e.length,h=r.extra,f=a&&a.length,l=un(h);ct(t,n,null!=s?33639248:67324752),n+=4,null!=s&&(t[n++]=20,t[n++]=r.os),t[n]=20,n+=2,t[n++]=r.flag<<1|(o<0&&8),t[n++]=i&&8,t[n++]=255&r.compression,t[n++]=r.compression>>8;var c=new Date(null==r.mtime?Date.now():r.mtime),p=c.getFullYear()-1980;if((p<0||p>119)&&I(10),ct(t,n,p<<25|c.getMonth()+1<<21|c.getDate()<<16|c.getHours()<<11|c.getMinutes()<<5|c.getSeconds()>>1),n+=4,-1!=o&&(ct(t,n,r.crc),ct(t,n+4,o<0?-o-2:o),ct(t,n+8,r.size)),ct(t,n+12,u),ct(t,n+14,l),n+=16,null!=s&&(ct(t,n,f),ct(t,n+6,r.attrs),ct(t,n+10,s),n+=14),t.set(e,n),n+=u,l)for(var v in h){var d=h[v],g=d.length;ct(t,n,+v),ct(t,n+2,g),t.set(d,n+4),n+=4+g}return f&&(t.set(a,n),n+=f),n},fn=function(t,n,r,e,i){ct(t,n,101010256),ct(t,n+8,r),ct(t,n+10,r),ct(t,n+12,e),ct(t,n+16,i)},ln=function(){function t(t){this.filename=t,this.c=Y(),this.size=0,this.compression=0}return t.prototype.process=function(t,n){this.ondata(null,t,n)},t.prototype.push=function(t,n){this.ondata||I(5),this.c.p(t),this.size+=t.length,n&&(this.crc=this.c.d()),this.process(t,n||!1)},t}();_e.ZipPassThrough=ln;var cn=function(){function t(t,n){var r=this;n||(n={}),ln.call(this,t),this.d=new wt(n,(function(t,n){r.ondata(null,t,n)})),this.compression=8,this.flag=en(n.level)}return t.prototype.process=function(t,n){try{this.d.push(t,n)}catch(t){this.ondata(t,null,n)}},t.prototype.push=function(t,n){ln.prototype.push.call(this,t,n)},t}();_e.ZipDeflate=cn;var pn=function(){function t(t,n){var r=this;n||(n={}),ln.call(this,t),this.d=new xt(n,(function(t,n,e){r.ondata(t,n,e)})),this.compression=8,this.flag=en(n.level),this.terminate=this.d.terminate}return t.prototype.process=function(t,n){this.d.push(t,n)},t.prototype.push=function(t,n){ln.prototype.push.call(this,t,n)},t}();_e.AsyncZipDeflate=pn;var vn=function(){function t(t){this.ondata=t,this.u=[],this.d=1}return t.prototype.add=function(t){var r=this;if(this.ondata||I(5),2&this.d)this.ondata(I(4+8*(1&this.d),0,1),null,!1);else{var e=nn(t.filename),i=e.length,o=t.comment,s=o&&nn(o),a=i!=t.filename.length||s&&o.length!=s.length,u=i+un(t.extra)+30;i>65535&&this.ondata(I(11,0,1),null,!1);var h=new n(u);hn(h,0,t,e,a,-1);var f=[h],l=function(){for(var t=0,n=f;t<n.length;t++)r.ondata(null,n[t],!1);f=[]},c=this.d;this.d=0;var p=this.u.length,v=Q(t,{f:e,u:a,o:s,t:function(){t.terminate&&t.terminate()},r:function(){if(l(),c){var t=r.u[p+1];t?t.r():r.d=1}c=1}}),d=0;t.ondata=function(e,i,o){if(e)r.ondata(e,i,o),r.terminate();else if(d+=i.length,f.push(i),o){var s=new n(16);ct(s,0,134695760),ct(s,4,t.crc),ct(s,8,d),ct(s,12,t.size),f.push(s),v.c=d,v.b=u+d+16,v.crc=t.crc,v.size=t.size,c&&v.r(),c=1}else c&&l()},this.u.push(v)}},t.prototype.end=function(){var t=this;2&this.d?this.ondata(I(4+8*(1&this.d),0,1),null,!0):(this.d?this.e():this.u.push({r:function(){1&t.d&&(t.u.splice(-1,1),t.e())},t:function(){}}),this.d=3)},t.prototype.e=function(){for(var t=0,r=0,e=0,i=0,o=this.u;i<o.length;i++)e+=46+(h=o[i]).f.length+un(h.extra)+(h.o?h.o.length:0);for(var s=new n(e+22),a=0,u=this.u;a<u.length;a++){var h;hn(s,t,h=u[a],h.f,h.u,-h.c-2,r,h.o),t+=46+h.f.length+un(h.extra)+(h.o?h.o.length:0),r+=h.b}fn(s,t,this.u.length,e,r),this.ondata(null,s,!0),this.d=2},t.prototype.terminate=function(){for(var t=0,n=this.u;t<n.length;t++)n[t].t();this.d=2},t}();function dn(t,r,e){e||(e=r,r={}),"function"!=typeof e&&I(7);var i={};Rt(t,"",i,r);var o=Object.keys(i),s=o.length,a=0,u=0,h=s,f=Array(s),l=[],c=function(){for(var t=0;t<l.length;++t)l[t]()},p=function(t,n){xn((function(){e(t,n)}))};xn((function(){p=e}));var v=function(){var t=new n(u+22),r=a,e=u-a;u=0;for(var i=0;i<h;++i){var o=f[i];try{var s=o.c.length;hn(t,u,o,o.f,o.u,s);var l=30+o.f.length+un(o.extra),c=u+l;t.set(o.c,c),hn(t,a,o,o.f,o.u,s,u,o.m),a+=16+l+(o.m?o.m.length:0),u=c+s}catch(t){return p(t,null)}}fn(t,a,f.length,e,r),p(null,t)};s||v();for(var d=function(t){var n=o[t],r=i[n],e=r[0],h=r[1],d=Y(),g=e.length;d.p(e);var y=nn(n),m=y.length,b=h.comment,w=b&&nn(b),x=w&&w.length,z=un(h.extra),k=0==h.level?0:8,M=function(r,e){if(r)c(),p(r,null);else{var i=e.length;f[t]=Q(h,{size:g,crc:d.d(),c:e,f:y,m:w,u:m!=n.length||w&&b.length!=x,compression:k}),a+=30+m+z+i,u+=76+2*(m+z)+(x||0)+i,--s||v()}};if(m>65535&&M(I(11,0,1),null),k)if(g<16e4)try{M(null,kt(e,h))}catch(t){M(t,null)}else l.push(zt(e,h,M));else M(null,e)},g=0;g<h;++g)d(g);return c}function gn(t,r){r||(r={});var e={},i=[];Rt(t,"",e,r);var o=0,s=0;for(var a in e){var u=e[a],h=u[0],f=u[1],l=0==f.level?0:8,c=(M=nn(a)).length,p=f.comment,v=p&&nn(p),d=v&&v.length,g=un(f.extra);c>65535&&I(11);var y=l?kt(h,f):h,m=y.length,b=Y();b.p(h),i.push(Q(f,{size:h.length,crc:b.d(),c:y,f:M,m:v,u:c!=a.length||v&&p.length!=d,o:o,compression:l})),o+=30+c+g+m,s+=76+2*(c+g)+(d||0)+m}for(var w=new n(s+22),x=o,z=s-o,k=0;k<i.length;++k){var M;hn(w,(M=i[k]).o,M,M.f,M.u,M.c.length);var S=30+M.f.length+un(M.extra);w.set(M.c,M.o+S),hn(w,o,M,M.f,M.u,M.c.length,M.o,M.m),o+=16+S+(M.m?M.m.length:0)}return fn(w,o,i.length,z,x),w}_e.Zip=vn,_e.zip=dn,_e.zipSync=gn;var yn=function(){function t(){}return t.prototype.push=function(t,n){this.ondata(null,t,n)},t.compression=0,t}();_e.UnzipPassThrough=yn;var mn=function(){function t(){var t=this;this.i=new Mt((function(n,r){t.ondata(null,n,r)}))}return t.prototype.push=function(t,n){try{this.i.push(t,n)}catch(t){this.ondata(t,null,n)}},t.compression=8,t}();_e.UnzipInflate=mn;var bn=function(){function t(t,n){var r=this;n<32e4?this.i=new Mt((function(t,n){r.ondata(null,t,n)})):(this.i=new St((function(t,n,e){r.ondata(t,n,e)})),this.terminate=this.i.terminate)}return t.prototype.push=function(t,n){this.i.terminate&&(t=D(t,0)),this.i.push(t,n)},t.compression=8,t}();_e.AsyncUnzipInflate=bn;var wn=function(){function t(t){this.onfile=t,this.k=[],this.o={0:yn},this.p=N}return t.prototype.push=function(t,r){var e=this;if(this.onfile||I(5),this.p||I(4),this.c>0){var i=Math.min(this.c,t.length),o=t.subarray(0,i);if(this.c-=i,this.d?this.d.push(o,!this.c):this.k[0].push(o),(t=t.subarray(i)).length)return this.push(t,r)}else{var s=0,a=0,u=void 0,h=void 0;this.p.length?t.length?((h=new n(this.p.length+t.length)).set(this.p),h.set(t,this.p.length)):h=this.p:h=t;for(var f=h.length,l=this.c,c=l&&this.d,p=function(){var t,n=ft(h,a);if(67324752==n){s=1,u=a,v.d=null,v.c=0;var r=ht(h,a+6),i=ht(h,a+8),o=2048&r,c=8&r,p=ht(h,a+26),d=ht(h,a+28);if(f>a+30+p+d){var g=[];v.k.unshift(g),s=2;var y,m=ft(h,a+18),b=ft(h,a+22),w=rn(h.subarray(a+30,a+=30+p),!o);4294967295==m?(t=c?[-2]:an(h,a),m=t[0],b=t[1]):c&&(m=-1),a+=d,v.c=m;var x={name:w,compression:i,start:function(){if(x.ondata||I(5),m){var t=e.o[i];t||x.ondata(I(14,"unknown compression type "+i,1),null,!1),(y=m<0?new t(w):new t(w,m,b)).ondata=function(t,n,r){x.ondata(t,n,r)};for(var n=0,r=g;n<r.length;n++)y.push(r[n],!1);e.k[0]==g&&e.c?e.d=y:y.push(N,!0)}else x.ondata(null,N,!0)},terminate:function(){y&&y.terminate&&y.terminate()}};m>=0&&(x.size=m,x.originalSize=b),v.onfile(x)}return"break"}if(l){if(134695760==n)return u=a+=12+(-2==l&&8),s=3,v.c=0,"break";if(33639248==n)return u=a-=4,s=3,v.c=0,"break"}},v=this;a<f-4&&"break"!==p();++a);if(this.p=N,l<0){var d=h.subarray(0,s?u-12-(-2==l&&8)-(134695760==ft(h,u-16)&&4):a);c?c.push(d,!!s):this.k[+(2==s)].push(d)}if(2&s)return this.push(h.subarray(a),r);this.p=h.subarray(a)}r&&(this.c&&I(13),this.p=null)},t.prototype.register=function(t){this.o[t.compression]=t},t}();_e.Unzip=wn;var xn="function"==typeof queueMicrotask?queueMicrotask:"function"==typeof setTimeout?setTimeout:function(t){t()};function zn(t,r,e){e||(e=r,r={}),"function"!=typeof e&&I(7);var i=[],o=function(){for(var t=0;t<i.length;++t)i[t]()},s={},a=function(t,n){xn((function(){e(t,n)}))};xn((function(){a=e}));for(var u=t.length-22;101010256!=ft(t,u);--u)if(!u||t.length-u>65558)return a(I(13,0,1),null),o;var h=ht(t,u+8);if(h){var f=h,l=ft(t,u+16),c=4294967295==l||65535==f;if(c){var p=ft(t,u-12);(c=101075792==ft(t,p))&&(f=h=ft(t,p+32),l=ft(t,p+48))}for(var v=r&&r.filter,d=function(r){var e=sn(t,l,c),u=e[0],f=e[1],p=e[2],d=e[3],g=e[4],y=on(t,e[5]);l=g;var m=function(t,n){t?(o(),a(t,null)):(n&&(s[d]=n),--h||a(null,s))};if(!v||v({name:d,size:f,originalSize:p,compression:u}))if(u)if(8==u){var b=t.subarray(y,y+f);if(p<524288||f>.8*p)try{m(null,Tt(b,{out:new n(p)}))}catch(t){m(t,null)}else i.push(At(b,{size:p},m))}else m(I(14,"unknown compression type "+u,1),null);else m(null,D(t,y,y+f));else m(null,null)},g=0;g<f;++g)d()}else a(null,{});return o}function kn(t,r){for(var e={},i=t.length-22;101010256!=ft(t,i);--i)(!i||t.length-i>65558)&&I(13);var o=ht(t,i+8);if(!o)return{};var s=ft(t,i+16),a=4294967295==s||65535==o;if(a){var u=ft(t,i-12);(a=101075792==ft(t,u))&&(o=ft(t,u+32),s=ft(t,u+48))}for(var h=r&&r.filter,f=0;f<o;++f){var l=sn(t,s,a),c=l[0],p=l[1],v=l[2],d=l[3],g=l[4],y=on(t,l[5]);s=g,h&&!h({name:d,size:p,originalSize:v,compression:c})||(c?8==c?e[d]=Tt(t.subarray(y,y+p),{out:new n(v)}):I(14,"unknown compression type "+c):e[d]=D(t,y,y+p))}return e}_e.unzip=zn,_e.unzipSync=kn;return _e});

// ===== 주간업무 HWPX(한글) 생성기 =====
// 회사 양식(hwpx) 원본의 실제 XML 문단 구조를 그대로 재사용 - 문단 스타일(paraPrIDRef 등)은
// 원본에서 뽑아낸 값을 고정으로 쓰고 텍스트만 갈아끼움. 항목 개수가 주마다 달라도 문단을 필요한 만큼
// 반복 생성하면 되므로 kordoc의 patchHwpx(항목 개수 고정 전제)보다 이 방식이 우리 상황에 맞음.
// 자동번호(1,2,3...)는 한글 자체의 문단 자동번호 기능이라 텍스트로 안 넣어도 됨.
// ⚠️ 아래 상수(WEEKLY_HWPX_TEMPLATE_URL, paraPrIDRef 값들)는 특정 원본 템플릿 파일 하나를 기준으로
//    뽑아낸 값이라, 템플릿 파일이 바뀌면 이 값들도 다시 뽑아서 맞춰야 함.
const WEEKLY_HWPX_TEMPLATE_URL = "https://hyorim-h.github.io/AI-team-dashboard-KOTI/assets/weekly-template.hwpx"; // TODO: 실제 업로드 경로로 확인 필요

function hwpxEscXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 원본 79/80/81번은 이미 파란색(#0000FF). 삭제필요 항목은 82/83/84(각각의 빨간색 버전)를 새로 만들어서 씀.
const HWPX_RED_TITLE = 82, HWPX_RED_LABEL = 83, HWPX_RED_VALUE = 84;

function hwpxSectionHeaderXml(label, paraPrId, pageBreak) {
  return `<hp:p id="2147483648" paraPrIDRef="${paraPrId}" styleIDRef="4" pageBreak="${pageBreak ? 1 : 0}" columnBreak="0" merged="0">`
    + `<hp:run charPrIDRef="77"><hp:t>&lt;${hwpxEscXml(label)}&gt;</hp:t></hp:run>`
    + `<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1500" textheight="1500" baseline="1275" spacing="1200" horzpos="0" horzsize="42520" flags="393216"/></hp:linesegarray></hp:p>`;
}
function hwpxProjectHeadingXml(text, paraPrId) {
  return `<hp:p id="2147483648" paraPrIDRef="${paraPrId}" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">`
    + `<hp:run charPrIDRef="78"><hp:t>${hwpxEscXml(text)}</hp:t></hp:run>`
    + `<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1300" textheight="1300" baseline="1105" spacing="1040" horzpos="0" horzsize="42520" flags="2490368"/></hp:linesegarray></hp:p>`;
}
function hwpxMeetingTitleXml(text, needsDelete) {
  const charPrId = needsDelete ? HWPX_RED_TITLE : 79;
  return `<hp:p id="0" paraPrIDRef="7" styleIDRef="9" pageBreak="0" columnBreak="0" merged="0">`
    + `<hp:run charPrIDRef="${charPrId}"><hp:t>□ ${hwpxEscXml(text)}</hp:t></hp:run>`
    + `<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1200" textheight="1200" baseline="1020" spacing="960" horzpos="1800" horzsize="40720" flags="393216"/></hp:linesegarray></hp:p>`;
}
function hwpxDetailLineXml(labelRunFn, valueText, needsDelete) {
  const valueCharPr = needsDelete ? HWPX_RED_VALUE : 81;
  return `<hp:p id="2147483648" paraPrIDRef="90" styleIDRef="3" pageBreak="0" columnBreak="0" merged="0">`
    + labelRunFn(needsDelete)
    + `<hp:run charPrIDRef="${valueCharPr}"><hp:t> ${hwpxEscXml(valueText)}</hp:t></hp:run>`
    + `<hp:linesegarray><hp:lineseg textpos="0" vertpos="0" vertsize="1200" textheight="1200" baseline="1020" spacing="780" horzpos="1800" horzsize="40720" flags="393216"/></hp:linesegarray></hp:p>`;
}
function hwpxLabelDate(needsDelete) {
  const id = needsDelete ? HWPX_RED_LABEL : 80;
  return `<hp:run charPrIDRef="${id}"><hp:t>- 일시·장소<hp:fwSpace/>:</hp:t></hp:run>`;
}
function hwpxLabelContent(needsDelete) {
  const id = needsDelete ? HWPX_RED_VALUE : 81;
  return `<hp:run charPrIDRef="${id}"><hp:t>-<hp:fwSpace/>내<hp:nbSpace/><hp:nbSpace/><hp:fwSpace/><hp:nbSpace/><hp:fwSpace/>용<hp:fwSpace/>:</hp:t></hp:run>`;
}
function hwpxLabelPeople(needsDelete) {
  const id = needsDelete ? HWPX_RED_VALUE : 81;
  return `<hp:run charPrIDRef="${id}"><hp:t>-<hp:fwSpace/>참<hp:fwSpace/> 석<hp:nbSpace/>자<hp:fwSpace/>:</hp:t></hp:run>`;
}
function hwpxMeetingBlockXml(meeting) {
  const nd = !!meeting.needsDelete;
  let xml = hwpxMeetingTitleXml(meeting.title, nd);
  xml += hwpxDetailLineXml(hwpxLabelDate, meeting.dateLocation || "", nd);
  xml += hwpxDetailLineXml(hwpxLabelContent, meeting.content || "", nd);
  xml += hwpxDetailLineXml(hwpxLabelPeople, meeting.attendees || "", nd);
  return xml;
}
function hwpxSectionBodyXml(projects, projectParaPrId) {
  let xml = "";
  projects.forEach(function (proj) {
    xml += hwpxProjectHeadingXml(proj.label, projectParaPrId);
    proj.meetings.forEach(function (m) { xml += hwpxMeetingBlockXml(m); });
  });
  return xml;
}
// achievements/plans: [{ label:"(DB사업) 「...」", meetings:[{title,dateLocation,content,attendees,needsDelete}, ...] }, ...]
// (실제 조립은 generateWeeklyHwpx 안에서 진행 - 섹션 제목의 paraPrIDRef가 템플릿 고유값이라 거기서 직접 넣음)

// header.xml에 79/80/81 각각의 빨간색(#FF0000) 버전을 82/83/84로 추가 (원본 정의를 복제 후 색만 교체)
function hwpxCloneCharPrAsRed(headerXml, srcId, newId) {
  const m = headerXml.match(new RegExp('<hh:charPr id="' + srcId + '"[^>]*>.*?</hh:charPr>'));
  if (!m) throw new Error("charPr id=" + srcId + "를 찾을 수 없습니다");
  return m[0].replace('id="' + srcId + '"', 'id="' + newId + '"').replace('textColor="#0000FF"', 'textColor="#FF0000"');
}
function hwpxPatchHeaderForRedColor(headerXml) {
  if (headerXml.indexOf('<hh:charPr id="' + HWPX_RED_TITLE + '"') >= 0) return headerXml;
  const m = headerXml.match(/<hh:charProperties itemCnt="(\d+)">/);
  if (!m) throw new Error("charProperties를 찾을 수 없습니다");
  const newCnt = parseInt(m[1], 10) + 3;
  const additions = hwpxCloneCharPrAsRed(headerXml, 79, HWPX_RED_TITLE)
    + hwpxCloneCharPrAsRed(headerXml, 80, HWPX_RED_LABEL)
    + hwpxCloneCharPrAsRed(headerXml, 81, HWPX_RED_VALUE);
  return headerXml
    .replace('<hh:charProperties itemCnt="' + m[1] + '">', '<hh:charProperties itemCnt="' + newCnt + '">')
    .replace('</hh:charProperties>', additions + '</hh:charProperties>');
}

// 큰 바이트 배열도 안전하게 base64로 변환(청크 단위로 처리 - 한 번에 apply하면 콜스택 넘칠 수 있어서)
function bytesToBase64(bytes) {
  var chunkSize = 8192, binary = "";
  for (var i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// 주간업무 데이터(achievements/plans, 과제별로 이미 그룹핑된 배열)로 실제 HWPX 파일 바이트를 생성
async function generateWeeklyHwpx(achievements, plans, wkR) {
  const res = await fetch(WEEKLY_HWPX_TEMPLATE_URL);
  if (!res.ok) throw new Error("HWPX 템플릿을 불러올 수 없습니다: HTTP " + res.status);
  const templateBytes = new Uint8Array(await res.arrayBuffer());
  const zip = self.fflate.unzipSync(templateBytes);

  const dec = new TextDecoder("utf-8"), enc = new TextEncoder();
  let section0 = dec.decode(zip["Contents/section0.xml"]);
  const header = dec.decode(zip["Contents/header.xml"]);

  // 표지의 날짜범위("YYYY.MM.DD. ~ YYYY.MM.DD.")와 주차("(N주차)")는 템플릿에 고정 텍스트로 박혀있어서
  // 실적/계획 본문과 달리 지금까지 자동으로 안 바뀌고 있었음 — 패턴 매칭으로 실제 값으로 치환
  if(wkR){
    const toDot = function(ymd){ return ymd.replace(/-/g, ".") + "."; };
    const coverDateText = toDot(wkR.start) + " ~ " + toDot(wkR.end);
    section0 = section0.replace(/\d{4}\.\d{2}\.\d{2}\.\s*~\s*\d{4}\.\d{2}\.\d{2}\./, coverDateText);
    section0 = section0.replace(/\(\d+주차\)/, "(" + wkR.weekNum + "주차)");
  }

  const startMarker = '<hp:p id="2147483648" paraPrIDRef="82"';
  const startIdx = section0.indexOf(startMarker);
  const endIdx = section0.indexOf("</hs:sec>");
  if (startIdx < 0 || endIdx < 0) throw new Error("템플릿에서 업무실적/업무계획 위치를 찾지 못했습니다(템플릿이 바뀌었을 수 있음)");

  let body = "";
  body += hwpxSectionHeaderXml("업무실적", 82, false);
  body += hwpxSectionBodyXml(achievements, 85);
  body += hwpxSectionHeaderXml("업무계획", 92, true);
  body += hwpxSectionBodyXml(plans, 95);

  const newSection0 = section0.slice(0, startIdx) + body + section0.slice(endIdx);
  const newHeader = hwpxPatchHeaderForRedColor(header);

  const newZipInput = {};
  Object.keys(zip).forEach(function (name) {
    if (name === "Contents/section0.xml") newZipInput[name] = enc.encode(newSection0);
    else if (name === "Contents/header.xml") newZipInput[name] = enc.encode(newHeader);
    else newZipInput[name] = zip[name];
  });
  // mimetype은 무압축으로 저장해야 함(ODF/OOXML류 zip 관례)
  const opts = { mimetype: { level: 0 } };
  return self.fflate.zipSync(newZipInput, opts);
}


const PROJECT_DB_ID = "ce0db68c-983d-83df-9c00-01f5668c56cd"; // 과제 정보 DB (노션 확인 database_id)
// 일정관리 페이지는 노션 DB가 아니라 두레이(Dooray) 캘린더를 소스로 사용 (아래 DOORAY_TEAM_CALENDAR_ID 참조)
const PERF_DB_ID   = "805db68c-983d-8331-b206-81d8ffbf09f3"; // 성과 DB
const ACHIEVE_DB_ID = "c1fdb68c-983d-83cd-b4c3-01802e4f88c6"; // 업무실적 DB
const PLAN_DB_ID    = "e7ddb68c-983d-835f-9958-01f98803acc0"; // 업무계획 DB
const MEETING_DB_ID = "782db68c-983d-82bf-b607-013f0314fcfb"; // 회의자료 DB
const COMMENT_DB_ID = "b4edb68c-983d-82f2-a7ab-01cbba6245c1"; // 코멘트 DB
const CONSIGN_DB_ID = "b2edb68c-983d-83fe-a580-815b224b17b9"; // 위탁과제 정보 DB
const CONSIGN_MEETING_DB_ID = "206db68c-983d-82f0-ad12-01188a5dd72f"; // 위탁과제 회의록 DB
const CONSIGN_REQUEST_DB_ID = "4ccdb68c-983d-831e-b5e7-0102bbce1354"; // 위탁과제 요청자료 DB
const NOTION_VERSION = "2022-06-28";

const TEAM = ["이종우","전준수","이채영","한효림","김예원","정승환"];

const NAME_MAP = { "AI빅데이터팀": "한효림", "js_koti": "전준수" };

function normProj(s){ if(!s) return ""; return s.replace(/[\s\u00a0\u200b]/g, ""); }

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}

async function notionFetch(path, token, method, body){
  method = method || "GET";
  const res = await fetch("https://api.notion.com/v1" + path, {
    method: method,
    headers: {
      "Authorization": "Bearer " + token,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if(!res.ok){ const t = await res.text(); throw new Error("Notion " + res.status + ": " + t); }
  return res.json();
}

async function getAllPages(dbId, token){
  let pages = [], cursor = undefined;
  do {
    const body = { page_size: 100 };
    if(cursor) body.start_cursor = cursor;
    const data = await notionFetch("/databases/" + dbId + "/query", token, "POST", body);
    pages = pages.concat(data.results || []);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while(cursor);
  return pages;
}

async function getPageContent(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = {}; let cur = null;
  for(const b of data.results || []){
    const t = b.type;
    if(t && t.startsWith("heading")){
      const rich = b[t].rich_text || [];
      cur = rich.map(function(x){return x.plain_text;}).join("").trim();
      sections[cur] = [];
    } else if(cur !== null){
      const rich = (b[t] && b[t].rich_text) || [];
      const text = rich.map(function(x){return x.plain_text;}).join("").trim();
      if(text) sections[cur].push(text);
    }
  }
  const out = {}; for(const k in sections) out[k] = sections[k].join("\n");
  return out;
}


// 관계형(relation) 속성에서 첫 번째 연결된 페이지 id 추출
function firstRelationId(prop){
  var arr = (prop && prop.relation) || [];
  return arr.length ? arr[0].id : "";
}

// 위탁과제 정보 파싱
function parseConsignment(page){
  const p = page.properties || {};
  const titleList = (p["과제명"] && p["과제명"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const orgRt = (p["수행기관"] && p["수행기관"].rich_text) || [];
  const org = orgRt.map(function(t){return t.plain_text;}).join("");
  const piRt = (p["책임자"] && p["책임자"].rich_text) || [];
  const pi = piRt.map(function(t){return t.plain_text;}).join("");
  const budgetRt = (p["위탁금액"] && p["위탁금액"].rich_text) || [];
  const budget = budgetRt.map(function(t){return t.plain_text;}).join("");
  const start = (p["시작일"] && p["시작일"].date && p["시작일"].date.start) || "";
  const end = (p["종료일"] && p["종료일"].date && p["종료일"].date.start) || "";
  const order = (p["정렬순서"] && typeof p["정렬순서"].number === "number") ? p["정렬순서"].number : 999;
  return { id: page.id, title: title, org: org, pi: pi, start: start, end: end, budget: budget, order: order };
}

// 위탁과제 회의록 파싱
function parseConsignMeeting(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = firstRelationId(p["과제"]);
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "월간회의";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "완료";
  const mode = (p["형태"] && p["형태"].select && p["형태"].select.name) || "대면";
  const date = (p["일시"] && p["일시"].date && p["일시"].date.start) || "";
  const attRt = (p["참석"] && p["참석"].rich_text) || [];
  const attendees = attRt.map(function(t){return t.plain_text;}).join("");
  const bodyRt = (p["내용"] && p["내용"].rich_text) || [];
  const body = bodyRt.map(function(t){return t.plain_text;}).join("");
  return { id: page.id, project: project, title: title, kind: kind, status: status, mode: mode, date: date, attendees: attendees, body: body };
}

// 위탁과제 요청자료 파싱 (Q&A는 페이지 본문에서 heading=질문, 본문=답변으로 파싱)
// getPageContent 확장판: heading 섹션별 본문 + 이미지 블록(그림)까지 캡처 (위탁과제 요청자료 Q&A용)
async function getPageContentWithFigures(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = {}; let cur = null;
  for(const b of data.results || []){
    const t = b.type;
    if(t && t.startsWith("heading")){
      const rich = b[t].rich_text || [];
      cur = rich.map(function(x){return x.plain_text;}).join("").trim();
      sections[cur] = { body: [], figures: [] };
    } else if(cur !== null){
      if(t === "image"){
        const img = b.image;
        const url = (img.type === "external") ? (img.external && img.external.url) : (img.file && img.file.url);
        const capRich = img.caption || [];
        const caption = capRich.map(function(x){return x.plain_text;}).join("").trim();
        if(url) sections[cur].figures.push({ url: url, caption: caption });
      } else {
        const rich = (b[t] && b[t].rich_text) || [];
        const text = rich.map(function(x){return x.plain_text;}).join("").trim();
        if(text) sections[cur].body.push(text);
      }
    }
  }
  const out = {};
  for(const k in sections){ out[k] = { body: sections[k].body.join("\n"), figures: sections[k].figures }; }
  return out;
}

async function parseConsignRequest(page, token){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = firstRelationId(p["과제"]);
  const category = (p["구분"] && p["구분"].select && p["구분"].select.name) || "기타";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "검토중";
  const reqDate = (p["요청일"] && p["요청일"].date && p["요청일"].date.start) || "";
  const replyDate = (p["회신일"] && p["회신일"].date && p["회신일"].date.start) || "";
  const reqFileRt = (p["요청파일명"] && p["요청파일명"].rich_text) || [];
  const reqFile = reqFileRt.map(function(t){return t.plain_text;}).join("");
  const replyFileRt = (p["회신파일명"] && p["회신파일명"].rich_text) || [];
  const replyFile = replyFileRt.map(function(t){return t.plain_text;}).join("");
  const content = await getPageContentWithFigures(page.id, token);
  const qa = [];
  for(const q in content){ qa.push({ q: q, a: content[q].body, figures: content[q].figures }); }
  return { id: page.id, project: project, title: title, category: category, status: status,
    reqDate: reqDate, replyDate: replyDate, reqFile: reqFile, replyFile: replyFile, qa: qa };
}

// 회의자료 페이지 파싱 (꼭지별 본문 포함)
// 대시보드용 경량 파싱: 속성만 읽고 본문(꼭지)·코멘트는 조회하지 않음 (빠름)
function parseMeetingLite(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "주간회의";
  const date = (p["회의날짜"] && p["회의날짜"].date && p["회의날짜"].date.start) || "";
  const sumRt = (p["요약"] && p["요약"].rich_text) || [];
  const headingList = sumRt.map(function(t){return t.plain_text;}).join("");
  const overviewRt = (p["회의요약"] && p["회의요약"].rich_text) || [];
  const summary = overviewRt.map(function(t){return t.plain_text;}).join("");
  const cntProp = p["코멘트수"];
  const commentCount = (cntProp && typeof cntProp.number === "number") ? cntProp.number : 0;
  return { id: page.id, title: title, project: project, kind: kind, date: date, summary: summary, headingList: headingList, commentCount: commentCount };
}

async function parseMeeting(page, token){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "주간회의";
  const date = (p["회의날짜"] && p["회의날짜"].date && p["회의날짜"].date.start) || "";
  const weekRt = (p["주차"] && p["주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  var wRt = (p["작성자"] && p["작성자"].rich_text) || [];
  const writer = wRt.map(function(t){return t.plain_text;}).join("");
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const placeRt = (p["장소"] && p["장소"].rich_text) || [];
  const place = placeRt.map(function(t){return t.plain_text;}).join("");
  const attRt = (p["참석자"] && p["참석자"].rich_text) || [];
  const attendees = attRt.map(function(t){return t.plain_text;}).join("");
  // "요약"은 꼭지 제목을 자동 나열한 값(updateMeeting이 매번 덮어씀) — 진짜 요약문이 아니므로 headingList로만 보존
  const sumRt = (p["요약"] && p["요약"].rich_text) || [];
  const headingList = sumRt.map(function(t){return t.plain_text;}).join("");
  // "회의요약"은 직접 작성하는 진짜 요약문(자동 덮어쓰기 없음) — 화면에 보여줄 summary는 이걸로
  const overviewRt = (p["회의요약"] && p["회의요약"].rich_text) || [];
  const summary = overviewRt.map(function(t){return t.plain_text;}).join("");
  // "결정사항"도 회의요약과 동일하게 전용 필드(자동 덮어쓰기 없음)
  const decisionRt = (p["결정사항"] && p["결정사항"].rich_text) || [];
  const decision = decisionRt.map(function(t){return t.plain_text;}).join("");

  // 본문 꼭지 (heading별로 묶음) — getPageContent는 이미지 블록을 건너뛰므로(rich_text만 읽음),
  // 위탁과제 요청자료에서 이미 쓰던 getPageContentWithFigures로 교체해서 이미지도 같이 읽어옴
  const content = await getPageContentWithFigures(page.id, token);
  const sections = [];
  for(const h in content){ sections.push({ heading: h, body: content[h].body, figures: content[h].figures || [] }); }

  return {
    id: page.id, title: title, project: project, kind: kind, date: date, week: week,
    time: time, place: place, attendees: attendees, summary: summary, decision: decision, headingList: headingList,
    writer: writer, sections: sections, last_edited: page.last_edited_time || "",
    page_url: page.url || ""
  };
}

// 특정 회의자료에 달린 코멘트 읽기
async function getComments(meetingId, token){
  const body = { page_size: 100,
    filter: { property: "회의자료", relation: { contains: meetingId } },
    sorts: [{ property: "작성시각", direction: "ascending" }] };
  const data = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST", body);
  return (data.results||[]).map(function(pg){
    const p = pg.properties || {};
    const tList = (p["코멘트"] && p["코멘트"].title) || [];
    const text = tList.map(function(t){return t.plain_text;}).join("");
    const author = (p["작성자"] && p["작성자"].select && p["작성자"].select.name) || "";
    const time = (p["작성시각"] && p["작성시각"].created_time) || "";
    return { id: pg.id, text: text, author: author, time: time };
  });
}

// parseWorkPage와 동일 로직이지만 동기 함수(추가 API 호출이 원래 없어서 async가 불필요) — map()에서 안전하게 쓰기 위함
function parseWorkPageLite(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const date = (p["날짜"] && p["날짜"].date && p["날짜"].date.start) || "";
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const weekRt = (p["출처주차"] && p["출처주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  const proj = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  return { id: page.id, title: title, date: date, time: time, project: proj, week: week };
}

// 업무실적/업무계획 페이지 파싱 (본문 섹션 포함)
async function parseWorkPage(page, token, isPlan){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const date = (p["날짜"] && p["날짜"].date && p["날짜"].date.start) || "";
  const dateEnd = (p["날짜"] && p["날짜"].date && p["날짜"].date.end) || "";
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const attendRt = (p["참석자"] && p["참석자"].rich_text) || [];
  const attendees = attendRt.map(function(t){return t.plain_text;}).join("");
  const weekRt = (p["출처주차"] && p["출처주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  const proj = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";

  var status = "", writer = "", modified = false, modifier = "";
  status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "";
  modified = (p["수정됨"] && p["수정됨"].checkbox) || false;
  var mRt = (p["수정자"] && p["수정자"].rich_text) || [];
  modifier = mRt.map(function(t){return t.plain_text;}).join("");
  var wRt = (p["작성자"] && p["작성자"].rich_text) || [];
  writer = wRt.map(function(t){return t.plain_text;}).join("");
  var editRt = (p["수정일시"] && p["수정일시"].rich_text) || [];
  var modifiedAt = editRt.map(function(t){return t.plain_text;}).join("");

  // 일시장소·내용은 속성에서 직접 (본문 블록 조회 안 함 → 빠름)
  var locRt = (p["일시장소"] && p["일시장소"].rich_text) || [];
  var location = locRt.map(function(t){return t.plain_text;}).join("");
  var bodyRt = (p["내용"] && p["내용"].rich_text) || [];
  var body = bodyRt.map(function(t){return t.plain_text;}).join("");
  var gcalRt = (p["캘린더ID"] && p["캘린더ID"].rich_text) || [];
  var gcalId = gcalRt.map(function(t){return t.plain_text;}).join("");

  return {
    id: page.id, title: title, date: date, dateEnd: dateEnd, time: time,
    project: proj, attendees: attendees, week: week,
    location: location, content: body,
    status: status, writer: writer, modified: modified, modifier: modifier,
    modified_at: modifiedAt, gcal_id: gcalId,
    last_edited: page.last_edited_time || "",
    page_url: page.url || ""
  };
}


// 과제 정보 DB 파싱 (과제별 그룹 헤더용: PM·참여자·기간)
function parseProjectInfo(page){
  const p = page.properties || {};
  const titleList = (p["과제명"] && p["과제명"].title) || [];
  const name = titleList.map(function(t){return t.plain_text;}).join("").trim();
  function msNames(prop){
    var arr = (prop && prop.multi_select) || [];
    return arr.map(function(x){return x.name;});
  }
  const main = msNames(p["Main"]);
  const sub = msNames(p["Sub"]);
  const pi = msNames(p["연구책임자"]); // multi_select (연구책임자 2명 이상 가능) - 연구진(Main/Sub)과 동일 타입
  const start = (p["시작"] && p["시작"].date && p["시작"].date.start) || "";
  const end = (p["종료"] && p["종료"].date && p["종료"].date.start) || "";
  const order = (p["정렬순서"] && typeof p["정렬순서"].number === "number") ? p["정렬순서"].number : 999;
  return { id: page.id, name: name, pi: pi, main: main, sub: sub, start: start, end: end, order: order };
}

// ===== 일정관리(구글 캘린더 기반) 분류 =====
// 제목 규칙: "휴가(효림)" / "외출(효림)" / "오전반차(효림)" 등 → 유형(효림)
// 출장 규칙: description(설명란)에 '출장' 단어 포함 → 유형=출장 (제목은 자유)
// 그 외 제목에 과제명 키워드 있으면 과제, 없으면 기타(회의 등 자유 제목)
const SCHED_PROJECT_KEYWORDS = [
  { kw: "국가교통조사", name: "국가교통조사사업" },
  { kw: "DB사업", name: "국가교통조사사업" },
  { kw: "통신", name: "국가교통조사사업" },
  { kw: "자율주행", name: "자율주행R&D" },
  { kw: "탄소", name: "탄소공간지도R&D" },        // "탄소공간지도"보다 넓게(탄소 포함이면 매칭)
  { kw: "교통SOC", name: "교통SOC R&D" },
  { kw: "데이터스페이스", name: "데이터스페이스R&D" },
];
const SCHED_VAC_TYPES = ["휴가","오전반차","오후반차","병가","공가","건강검진"];
// 팀원 짧은 이름("예원") → 풀네임("김예원") 정규화 (일정 제목/설명란에 짧게 적힌 경우 대비)
const SCHED_TEAM = ["이숭봉","이종우","전준수","이채영","한효림","김예원","정승환","심지윤","정정호"];
function schedShortName(o){ return (o && o.length>=3) ? o.slice(1) : o; }
function normalizePersonName(t){
  if(!t) return t;
  t = t.trim();
  var hit = SCHED_TEAM.filter(function(o){ return o===t || schedShortName(o)===t; })[0];
  return hit || t; // 팀원 명단에 없으면(외부인 등) 원문 그대로
}
function normalizePersonList(raw){
  if(!raw) return raw;
  return raw.split(/[,\s]+/).map(function(x){return x.trim();}).filter(Boolean).map(normalizePersonName).join(", ");
}
const SCHED_ATT_TYPES = SCHED_VAC_TYPES.concat(["외출"]);
// "휴가(효림)" / "외출(효림)" 등
const SCHED_RE_PAREN = new RegExp("(" + SCHED_ATT_TYPES.join("|") + ")\\s*\\(([^)]+)\\)\\s*$");
// 과거 형식 "효림 휴가" / "효림-외출" 등 (이름이 앞)
const SCHED_RE_LEGACY = new RegExp("^([^\\s()]{2,6})\\s*[\\-\\s]?\\s*(" + SCHED_ATT_TYPES.join("|") + ")\\s*$");
// "출장" 등 그 외 임의 제목 + "(이름)" 형식 — 위 SCHED_RE_PAREN에 안 걸린 나머지를 여기서 잡음 (예: "세종출장(효림)", "킥오프(효림, 예원)")
const SCHED_RE_GENERIC_PAREN = /^(.+)\(([^()]+)\)\s*$/;
// 괄호 안 텍스트가 실제 팀원 이름(들)인지 검증 (콤마/공백 구분, 전원 팀원이어야 통과) — 오탐 방지용
function isKnownTeamName(t){
  if(!t) return false;
  t = t.trim();
  return SCHED_TEAM.indexOf(t) >= 0 || SCHED_TEAM.some(function(o){ return schedShortName(o) === t; });
}
function isKnownTeamNameList(raw){
  if(!raw) return false;
  var parts = raw.split(/[,\s]+/).map(function(x){ return x.trim(); }).filter(Boolean);
  return parts.length > 0 && parts.every(isKnownTeamName);
}

function extractPersonFromDesc(desc){
  if(!desc) return "";
  var m = desc.match(/담당자\s*[:：]\s*([^\n\r]+)/);
  return m ? normalizePersonName(m[1].trim()) : "";
}
function extractAttendeesFromDesc(desc){
  if(!desc) return "";
  var m = desc.match(/참석자\s*[:：]\s*([^\n\r]+)/);
  return m ? normalizePersonList(m[1].trim()) : "";
}
// 설명란에 명시적으로 적힌 "과제: XXX"(드롭다운으로 직접 고른 값) — 제목에 남은 예전 키워드보다 이걸 우선해야 함
var SCHED_PROJECT_NAMES = SCHED_PROJECT_KEYWORDS.map(function(x){ return x.name; }).filter(function(v,i,a){ return a.indexOf(v)===i; });
function extractExplicitProject(desc){
  if(!desc) return "";
  var m = desc.match(/과제\s*[:：]\s*([^\n\r]+)/);
  if(!m) return "";
  var val = m[1].trim();
  return (SCHED_PROJECT_NAMES.indexOf(val) >= 0) ? val : "";
}
function classifySchedule(ev){
  var title = (ev.title || "").trim();
  var desc = ev.desc || "";
  var type = "", person = "", vacation = "", project = "";

  var mp = title.match(SCHED_RE_PAREN);
  var ml = !mp && title.match(SCHED_RE_LEGACY);
  var mg = !mp && !ml && title.match(SCHED_RE_GENERIC_PAREN);
  if(mp){
    type = (SCHED_VAC_TYPES.indexOf(mp[1]) >= 0) ? "휴가" : mp[1];
    if(SCHED_VAC_TYPES.indexOf(mp[1]) >= 0) vacation = mp[1];
    var rawName1 = mp[2].trim();
    person = (rawName1.indexOf(",")>=0) ? normalizePersonList(rawName1) : normalizePersonName(rawName1);
  } else if(ml){
    type = (SCHED_VAC_TYPES.indexOf(ml[2]) >= 0) ? "휴가" : ml[2];
    if(SCHED_VAC_TYPES.indexOf(ml[2]) >= 0) vacation = ml[2];
    var rawName2 = ml[1].trim();
    person = (rawName2.indexOf(",")>=0) ? normalizePersonList(rawName2) : normalizePersonName(rawName2);
  } else if(mg && mg[1].trim() && isKnownTeamNameList(mg[2])){
    // "휴가/오전반차/외출" 등(SCHED_RE_PAREN)에 안 걸린 "제목(이름)" 형식 → 괄호 안이 팀원이면 출장으로 처리
    // (예: "출장(효림)", "세종 킥오프(효림, 예원)" 등 — 접두어는 자유 텍스트)
    type = "출장";
    var rawName3 = mg[2].trim();
    person = (rawName3.indexOf(",")>=0) ? normalizePersonList(rawName3) : normalizePersonName(rawName3);
    var prefix3 = mg[1].trim();
    var matchedProj3 = SCHED_PROJECT_KEYWORDS.filter(function(x){ return prefix3.indexOf(x.kw) >= 0; })[0];
    if(matchedProj3) project = matchedProj3.name;
  } else if(desc.indexOf("출장") >= 0){
    type = "출장";
    person = extractPersonFromDesc(desc);
    project = extractExplicitProject(desc);
  } else {
    var explicitProj = extractExplicitProject(desc);
    if(explicitProj){ type = "과제"; project = explicitProj; person = extractPersonFromDesc(desc); }
    else {
      var matched = SCHED_PROJECT_KEYWORDS.filter(function(x){ return title.indexOf(x.kw) >= 0 || desc.indexOf(x.kw) >= 0; })[0];
      if(matched){ type = "과제"; project = matched.name; person = extractPersonFromDesc(desc); }
      else { type = "기타"; person = extractPersonFromDesc(desc); }
    }
  }
  var attendees = extractAttendeesFromDesc(desc);
  return { type: type, person: person, vacation: vacation, project: project, attendees: attendees };
}

// ===== 두레이(Dooray!) 캘린더 연동 (공공기관용 gov-dooray.com, 개인 API 토큰) =====
// "교통빅데이터팀" 캘린더 - 아이폰 캘린더에도 같이 연동해둔 팀 공유 캘린더를 대시보드/일정관리에 병합
const DOORAY_API_BASE = "https://api.gov-dooray.com";
const DOORAY_TEAM_CALENDAR_ID = "4193093966505478406"; // 교통빅데이터팀

// Dooray event → 대시보드 표시용 객체(구글 캘린더와 동일한 형태로 변환, 기존 classifySchedule 그대로 재사용)
function parseDoorayEvent(ev){
  var title = ev.subject || "(제목 없음)";
  var location = ev.location || "";
  var start = "", end = "", time = "", timeEnd = "";
  var startedAt = ev.startedAt || "", endedAt = ev.endedAt || "";
  if(ev.wholeDayFlag){
    start = startedAt.slice(0,10);
    var endRaw = endedAt.slice(0,10);
    if(endRaw){
      // 두레이 종일 일정도 구글과 동일하게 end가 다음날(배타적) → 하루 빼서 실제 마지막 날로
      var d = new Date(endRaw + "T00:00:00"); d.setDate(d.getDate()-1);
      function z(n){ return (n<10?"0":"")+n; }
      end = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
      if(end < start) end = start;
    } else end = start;
  } else {
    start = startedAt.slice(0,10);
    var m1 = startedAt.match(/T(\d{2}):(\d{2})/); if(m1) time = m1[1]+":"+m1[2];
    end = endedAt.slice(0,10) || start;
    var m2 = endedAt.match(/T(\d{2}):(\d{2})/); if(m2) timeEnd = m2[1]+":"+m2[2];
  }
  // 두레이 이벤트에는 구글의 "설명란"에 해당하는 필드가 없어 제목만으로 분류
  // (휴가(이름)/외출(이름)/과제 키워드 형식은 구글 쪽과 동일한 규칙을 그대로 따름)
  var cls = classifySchedule({ title: title, desc: "" });
  var timeStr = time ? (time + (timeEnd && timeEnd!==time ? "~"+timeEnd : "")) : "";
  return {
    id: "dooray-" + ev.id, title: title, type: cls.type, person: cls.person, project: cls.project,
    vacation: cls.vacation, attendees: cls.attendees, start: start, end: end, time: timeStr, location: location,
    raw_desc: ""
  };
}

// ===== 일정 유형 오버라이드 (노션 DB) =====
// 두레이 본문(body)을 다시 읽어올 방법이 없어서(권한상 불가, 실측 확인), 제목만으로는 안 잡히는 출장/과제 등을
// 수동으로 지정한 내용을 여기 저장해두고, 조회할 때마다 원본 이벤트ID로 매칭해서 유형을 덮어씌움
const SCHED_OVERRIDE_DB_ID = "238db68c-983d-82c2-8bbb-01f9cfc02c0d";
async function getScheduleOverrides(env){
  const token = env.NOTION_TOKEN;
  const pages = await getAllPages(SCHED_OVERRIDE_DB_ID, token);
  var map = {};
  pages.forEach(function(pg){
    var p = pg.properties || {};
    var idRt = (p["원본ID"] && p["원본ID"].title) || [];
    var origId = idRt.map(function(t){ return t.plain_text; }).join("").trim();
    if(!origId) return;
    var personRt = (p["담당자"] && p["담당자"].rich_text) || [];
    var vacRt = (p["휴가구분"] && p["휴가구분"].rich_text) || [];
    var attRt = (p["참석자"] && p["참석자"].rich_text) || [];
    map[origId] = {
      pageId: pg.id,
      type: (p["유형"] && p["유형"].select && p["유형"].select.name) || "",
      person: personRt.map(function(t){ return t.plain_text; }).join(""),
      project: (p["과제"] && p["과제"].select && p["과제"].select.name) || "",
      vacation: vacRt.map(function(t){ return t.plain_text; }).join(""),
      attendees: attRt.map(function(t){ return t.plain_text; }).join("")
    };
  });
  return map;
}
function applyScheduleOverride(event, overrides){
  var ov = overrides && overrides[doorayOrigId(event.id)];
  if(!ov) return event;
  if(ov.type) event.type = ov.type;
  if(ov.person) event.person = ov.person;
  if(ov.project) event.project = ov.project;
  if(ov.vacation) event.vacation = ov.vacation;
  if(ov.attendees) event.attendees = ov.attendees;
  return event;
}
// 오버라이드 저장(있으면 갱신, 없으면 새로 생성) - 출장/과제처럼 제목만으로 못 잡는 유형을 수동 지정할 때 호출
async function upsertScheduleOverride(env, origId, fields){
  const token = env.NOTION_TOKEN;
  var overrides = await getScheduleOverrides(env);
  var existing = overrides[origId];
  var props = {
    "원본ID": { title: rt(origId) },
    "유형": { select: { name: fields.type } },
    "담당자": { rich_text: rt(fields.person || "") },
    "휴가구분": { rich_text: rt(fields.vacation || "") },
    "참석자": { rich_text: rt(fields.attendees || "") },
  };
  if(fields.project) props["과제"] = { select: { name: fields.project } };
  if(existing){
    await notionFetch("/pages/" + existing.pageId, token, "PATCH", { properties: props });
  } else {
    await notionFetch("/pages", token, "POST", { parent: { database_id: SCHED_OVERRIDE_DB_ID }, properties: props });
  }
}
async function deleteScheduleOverride(env, origId){
  const token = env.NOTION_TOKEN;
  var overrides = await getScheduleOverrides(env);
  var existing = overrides[origId];
  if(existing) await notionFetch("/pages/" + existing.pageId, token, "PATCH", { archived: true });
}

async function doorayListRange(env, timeMinISO, timeMaxISO, overrides){
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var url = DOORAY_API_BASE + "/calendar/v1/calendars/*/events"
    + "?calendars=" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID)
    + "&timeMin=" + encodeURIComponent(timeMinISO)
    + "&timeMax=" + encodeURIComponent(timeMaxISO);
  var res = await fetch(url, { headers: { "Authorization": "dooray-api " + token } });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful){
    throw new Error("두레이 캘린더 조회 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  }
  var ov = overrides || await getScheduleOverrides(env);
  return (data.result || []).map(parseDoorayEvent).filter(function(e){ return e.type; }).map(function(e){ return applyScheduleOverride(e, ov); });
}
// 두레이는 문서엔 "최대 1년치"라고 돼있지만 실제로는 한 달을 넘기면 USER_INVALID_EXCEED_MAXIMUM_PERIOD로 거부됨(실측 확인).
// 지난 날짜는 노션 아카이브가 담당하므로, 여기선 "이번달/다음달"만 한 달씩 나눠 병렬로 조회한 뒤 합침
function doorayMonthChunks(){
  var kst = new Date(Date.now() + 9*60*60*1000); // UTC → KST 보정해서 "지금이 한국 시간으로 며칠인지" 얻기
  var y = kst.getUTCFullYear(), m = kst.getUTCMonth();
  function z(n){ return (n<10?"0":"")+n; }
  function fmt(yy, mm, dd, hh, mi, ss){ return yy+"-"+z(mm+1)+"-"+z(dd)+"T"+z(hh)+":"+z(mi)+":"+z(ss)+"+09:00"; }
  var chunks = [];
  for(var i=0;i<=1;i++){
    var yy = y, mm = m + i;
    while(mm < 0){ mm += 12; yy--; }
    while(mm > 11){ mm -= 12; yy++; }
    var daysInMonth = new Date(Date.UTC(yy, mm+1, 0)).getUTCDate();
    chunks.push({ timeMin: fmt(yy, mm, 1, 0,0,0), timeMax: fmt(yy, mm, daysInMonth, 23,59,59) });
  }
  return chunks;
}
async function doorayList(env){
  var chunks = doorayMonthChunks();
  var overrides = await getScheduleOverrides(env);
  var settled = await Promise.allSettled(chunks.map(function(c){ return doorayListRange(env, c.timeMin, c.timeMax, overrides); }));
  var out = [], firstError = null;
  settled.forEach(function(r){
    if(r.status === "fulfilled") out = out.concat(r.value);
    else if(!firstError) firstError = r.reason;
  });
  if(out.length === 0 && firstError) throw firstError; // 전부 실패했을 때만 에러로 전파(부분 실패는 있는 만큼만 반영)
  // 월 경계에 걸친(여러 청크에 겹쳐 조회되는) 이벤트 중복 제거
  var seen = {}, dedup = [];
  out.forEach(function(e){ if(!seen[e.id]){ seen[e.id]=1; dedup.push(e); } });
  return dedup;
}

// ===== 일정 아카이브 (노션 DB) =====
// 두레이 조회 기간 제한(약 한 달) 때문에, "오늘 이전" 일정은 매일 크론으로 노션에 옮겨 저장해두고 여기서 불러옴.
// "오늘 이후"는 항상 두레이에서 실시간으로 조회.
const SCHEDULE_ARCHIVE_DB_ID = "caddb68c-983d-82e9-84b2-01dc5dcd0ac7";

function todayKST(){
  var kst = new Date(Date.now() + 9*60*60*1000);
  function z(n){ return (n<10?"0":"")+n; }
  return kst.getUTCFullYear()+"-"+z(kst.getUTCMonth()+1)+"-"+z(kst.getUTCDate());
}
function parseArchivedSchedule(page){
  const p = page.properties || {};
  function txt(name){ var r=(p[name]&&p[name].rich_text)||[]; return r.map(function(t){return t.plain_text;}).join(""); }
  function ttl(name){ var r=(p[name]&&p[name].title)||[]; return r.map(function(t){return t.plain_text;}).join(""); }
  function sel(name){ return (p[name]&&p[name].select&&p[name].select.name)||""; }
  function dt(name){ return (p[name]&&p[name].date&&p[name].date.start)||""; }
  return {
    id: "archive-" + page.id, title: ttl("제목"), type: sel("유형"), person: txt("담당자"),
    project: sel("과제"), vacation: txt("휴가구분"), attendees: txt("참석자"),
    start: (dt("시작일")||"").slice(0,10), end: (dt("종료일")||dt("시작일")||"").slice(0,10),
    time: txt("시간"), location: txt("장소"), raw_desc: "", origId: txt("원본ID")
  };
}
// 아카이브 DB 전체 조회(오늘 이전 것만) - 매 요청마다 전체를 훑는 구조라 데이터가 아주 많아지면 나중에 날짜 필터 API로 바꿔야 할 수 있음
async function archivedScheduleList(env){
  const token = env.NOTION_TOKEN;
  const pages = await getAllPages(SCHEDULE_ARCHIVE_DB_ID, token);
  var today = todayKST();
  return pages.map(parseArchivedSchedule).filter(function(x){ return x.title && x.start && x.start < today; });
}
// 어제 하루치 두레이 일정을 노션 아카이브에 저장(매일 크론으로 실행). 이미 저장된 건(원본ID 기준) 건너뜀
// 두레이 이벤트 목록을 노션 아카이브에 저장(이미 있는 원본ID는 건너뜀). existingIds는 미리 조회해둔 {원본ID: true} 맵
async function archiveEventsToNotion(env, events, existingIds){
  const token = env.NOTION_TOKEN;
  var created = 0;
  for(var i=0;i<events.length;i++){
    var e = events[i];
    var origId = e.id.indexOf("dooray-")===0 ? e.id.slice(7) : e.id;
    if(existingIds[origId]) continue;
    var props = {
      "제목": { title: rt(e.title) },
      "담당자": { rich_text: rt(e.person) },
      "휴가구분": { rich_text: rt(e.vacation) },
      "참석자": { rich_text: rt(e.attendees) },
      "시간": { rich_text: rt(e.time) },
      "장소": { rich_text: rt(e.location) },
      "원본ID": { rich_text: rt(origId) },
      "시작일": { date: { start: e.start } },
      "종료일": { date: { start: e.end || e.start } },
    };
    if(e.type) props["유형"] = { select: { name: e.type } };
    if(e.project) props["과제"] = { select: { name: e.project } };
    await notionFetch("/pages", token, "POST", { parent:{ database_id: SCHEDULE_ARCHIVE_DB_ID }, properties: props });
    existingIds[origId] = true; // 같은 배치 안에서 중복 생성 방지
    created++;
  }
  return created;
}
async function getArchiveExistingIds(env){
  const token = env.NOTION_TOKEN;
  var existingPages = await getAllPages(SCHEDULE_ARCHIVE_DB_ID, token);
  var existingIds = {};
  existingPages.forEach(function(pg){
    var r = (pg.properties["원본ID"] && pg.properties["원본ID"].rich_text) || [];
    var v = r.map(function(t){return t.plain_text;}).join("");
    if(v) existingIds[v] = true;
  });
  return existingIds;
}
// 어제 하루치 두레이 일정을 노션 아카이브에 저장(매일 크론으로 실행). 이미 저장된 건(원본ID 기준) 건너뜀
async function archiveOneDay(env, dayStr){
  var overrides = await getScheduleOverrides(env);
  var events = await doorayListRange(env, dayStr+"T00:00:00+09:00", dayStr+"T23:59:59+09:00", overrides);
  var existingIds = await getArchiveExistingIds(env);
  var created = await archiveEventsToNotion(env, events, existingIds);
  return { archived: created, checked: events.length, day: dayStr };
}
async function archiveYesterdaySchedule(env){
  var kst = new Date(Date.now() + 9*60*60*1000);
  var y = kst.getUTCFullYear(), m = kst.getUTCMonth(), d = kst.getUTCDate() - 1;
  var yest = new Date(Date.UTC(y, m, d));
  function z(n){ return (n<10?"0":"")+n; }
  var dayStr = yest.getUTCFullYear()+"-"+z(yest.getUTCMonth()+1)+"-"+z(yest.getUTCDate());
  return await archiveOneDay(env, dayStr);
}
// 지정한 기간(fromDateStr~toDateStr, "YYYY-MM-DD")을 통째로 백필 — 과거 데이터를 한 번에 몰아서 노션에 채워 넣을 때 사용.
// 두레이 조회 기간 제한(약 한 달) 때문에 내부적으로 한 달 단위 청크로 나눠서 순차 조회함.
// 주의: 한 청크 안에 새로 만들어야 할 일정이 많으면 Cloudflare 서브요청 한도(50개)에 걸릴 수 있음 —
// 그런 경우 archiveOneDay(action: "archiveDay")로 하루씩 나눠서 호출할 것.
async function archiveDateRange(env, fromDateStr, toDateStr){
  function parseYMD(s){ var p=String(s).split("-").map(function(x){return parseInt(x,10);}); return { y:p[0], m:p[1]-1, d:p[2] }; }
  function z(n){ return (n<10?"0":"")+n; }
  function cmp(a,b){ return (a.y*10000+a.m*100+a.d) - (b.y*10000+b.m*100+b.d); }
  var from = parseYMD(fromDateStr), to = parseYMD(toDateStr);
  if(isNaN(from.y) || isNaN(to.y) || cmp(from, to) > 0) throw new Error("날짜 범위가 올바르지 않습니다(from이 to보다 늦거나 형식이 잘못됨)");
  var existingIds = await getArchiveExistingIds(env);
  var overrides = await getScheduleOverrides(env);
  var totalChecked = 0, totalCreated = 0, chunkCount = 0;
  var cursor = { y: from.y, m: from.m, d: from.d };
  while(cmp(cursor, to) <= 0){
    var monthLastDay = new Date(Date.UTC(cursor.y, cursor.m+1, 0)).getUTCDate(); // 안전: 순수 날짜 계산용(시간대 변환 없음)
    var chunkEnd = { y: cursor.y, m: cursor.m, d: monthLastDay };
    if(cmp(chunkEnd, to) > 0) chunkEnd = { y: to.y, m: to.m, d: to.d };
    var startStr = cursor.y+"-"+z(cursor.m+1)+"-"+z(cursor.d)+"T00:00:00+09:00";
    var endStr = chunkEnd.y+"-"+z(chunkEnd.m+1)+"-"+z(chunkEnd.d)+"T23:59:59+09:00";
    var events = await doorayListRange(env, startStr, endStr, overrides);
    totalChecked += events.length;
    totalCreated += await archiveEventsToNotion(env, events, existingIds);
    chunkCount++;
    // 다음 청크: 다음 달 1일로 이동
    var ny = cursor.y, nm = cursor.m + 1;
    if(nm > 11){ nm = 0; ny++; }
    cursor = { y: ny, m: nm, d: 1 };
  }
  return { archived: totalCreated, checked: totalChecked, chunks: chunkCount, from: fromDateStr, to: toDateStr };
}

// ===== 로그인(접근 장벽 수준 - 진짜 계정 시스템 아님, 팀 공용 아이디/비밀번호 하나로 체크) =====
// Cloudflare Worker 환경변수에 TEAM_LOGIN_ID / TEAM_LOGIN_PW 를 secret으로 등록해야 동작함
async function checkLogin(env, payload){
  var expectId = env.TEAM_LOGIN_ID, expectPw = env.TEAM_LOGIN_PW;
  if(!expectId || !expectPw) throw new Error("TEAM_LOGIN_ID/TEAM_LOGIN_PW 미설정");
  var ok = (String(payload.id||"") === String(expectId)) && (String(payload.pw||"") === String(expectPw));
  return { authed: ok };
}

// 아카이브(오늘 이전) + 두레이 실시간(오늘 이후)을 병합해서 하나의 일정 목록으로 - 한쪽이 실패해도 다른 쪽은 그대로 반영
function doorayOrigId(id){ return String(id||"").indexOf("dooray-")===0 ? id.slice(7) : id; }
async function combinedScheduleList(env){
  var results = await Promise.allSettled([
    archivedScheduleList(env),
    doorayList(env),
  ]);
  var out = [];
  var errors = {};
  if(results[0].status === "fulfilled") out = out.concat(results[0].value);
  else errors.archiveScheduleError = String(results[0].reason);
  if(results[1].status === "fulfilled") out = out.concat(results[1].value);
  else errors.doorayScheduleError = String(results[1].reason);
  // 아카이브(과거)와 두레이 실시간(이번달+다음달, 오늘 이전 날짜도 포함)이 겹칠 수 있어서 원본 이벤트ID 기준 중복 제거
  // (크론이 실패해서 아카이브가 비어있는 날도, 두레이 실시간 쪽에 그대로 남아있어서 통째로 안 사라지게)
  var seen = {}, dedup = [];
  out.forEach(function(e){
    var key = e.origId || doorayOrigId(e.id); // 아카이브 항목은 저장해둔 원본ID, 두레이 실시간 항목은 id에서 추출
    if(key && seen[key]) return;
    if(key) seen[key] = true;
    dedup.push(e);
  });
  return { items: dedup, errors: errors };
}


function parsePerf(page){
  const p = page.properties || {};
  const titleList = (p["성과명"] && p["성과명"].title) || [];
  const name = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const type = (p["구분"] && p["구분"].select && p["구분"].select.name) || "";
  const owner = (p["담당자"] && p["담당자"].select && p["담당자"].select.name) || "";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "";
  const detailRt = (p["세부내용"] && p["세부내용"].rich_text) || [];
  const detail = detailRt.map(function(t){return t.plain_text;}).join("");
  const due = (p["기한"] && p["기한"].date && p["기한"].date.start) || "";
  const progress = (p["진행률"] && typeof p["진행률"].number === "number") ? p["진행률"].number : 0;
  const startYear = (p["시작연도"] && typeof p["시작연도"].number === "number") ? p["시작연도"].number : null;
  const chkRt = (p["체크리스트"] && p["체크리스트"].rich_text) || [];
  const checklist = chkRt.map(function(t){return t.plain_text;}).join("");
  return {
    id: page.id, name: name, project: project, type: type, owner: owner,
    status: status, detail: detail, due: due, progress: progress, checklist: checklist,
    start_year: startYear,
    page_url: page.url || ""
  };
}

// ===== 노션 쓰기 (업무실적/업무계획 저장) =====
function rt(text){ return [{ type:"text", text:{ content: String(text||"") } }]; }

// 업무계획 캘린더 동기화: event id로 캘린더 조회 → 날짜·시간·제목만 노션에 반영
// (장소·내용·참석자는 노션 값 유지)
// 프론트(weekly-work.html)의 computePeriod/weekLabelText와 동일 로직 (오늘 기준 실시간 계산, 저장 데이터에 의존하지 않음)
function z2(n){ return (n<10?"0":"")+n; }
function ymdOf(d){ return d.getFullYear()+"-"+z2(d.getMonth()+1)+"-"+z2(d.getDate()); }
function isoWeekNumSrv(ymdStr){
  var d=new Date(ymdStr+"T00:00:00");
  var target=new Date(d.valueOf()); var dayNr=(d.getDay()+6)%7;
  target.setDate(target.getDate()-dayNr+3);
  var firstThu=target.valueOf();
  target.setMonth(0,1);
  if(target.getDay()!==4){ target.setMonth(0,1+((4-target.getDay())+7)%7); }
  return 1+Math.ceil((firstThu-target)/604800000);
}
function currentWeekRange(offsetWeeks){
  var offset = offsetWeeks || 0;
  var today=new Date();
  var dow=today.getDay();
  var monOffset=(dow===0)?-6:(1-dow);
  var mon=new Date(today); mon.setDate(today.getDate()+monOffset+offset*7); mon.setHours(0,0,0,0);
  var fri=new Date(mon); fri.setDate(mon.getDate()+4);
  var nextMon=new Date(mon); nextMon.setDate(mon.getDate()+7);
  var nextFri=new Date(nextMon); nextFri.setDate(nextMon.getDate()+4);
  var aStart=ymdOf(mon), aEnd=ymdOf(fri);
  var pStart=ymdOf(nextMon), pEnd=ymdOf(nextFri);
  var awn=isoWeekNumSrv(aStart)-1, pwn=isoWeekNumSrv(pStart)-1;
  return {
    // 실적주(오프셋 적용된 기준주)
    start: aStart, end: aEnd, weekNum: awn, label: aStart+" ~ "+aEnd.slice(5)+" ("+awn+"주차)",
    // 계획주(기준주+1주) — 캘린더 동기화·PDF 계획 읽기는 오프셋 없이(실제 현재) 이 범위를 대상으로 함
    planStart: pStart, planEnd: pEnd, planLabel: pStart+" ~ "+pEnd.slice(5)+" ("+pwn+"주차)"
  };
}
function currentWeekLabel(){ return currentWeekRange().label; }

// 업무계획 캘린더 동기화: 이번 주(월~금) 팀 캘린더에서 "과제/기타"(회의 등 업무성) 일정만 대상.
// 휴가/외출/출장은 개인 일정관리용이라 제외. 이미 가져온 항목(캘린더ID로 연결)은 날짜·시간·제목만 갱신,
// 아직 없는 항목은 새 업무계획으로 생성 (장소·내용·참석자는 비워둠 → 직접 채워넣기).
async function syncPlansFromCalendar(env){
  const token = env.NOTION_TOKEN;
  var result = { checked:0, updated:0, missing:0, imported:0 };
  var wk = currentWeekRange();
  // 캘린더 동기화는 "계획주"(다음주) 범위를 대상으로 함 — 실적주(이번주)가 아님
  var events = await doorayList(env);
  events = events.filter(function(ev){
    return ev.start >= wk.planStart && ev.start <= wk.planEnd
      && (ev.type === "과제" || ev.type === "기타"); // 휴가/외출/출장 등은 제외
  });

  // 계획주 기존 업무계획 조회 — 캘린더ID로도, (날짜+제목)으로도 매칭 (PDF 등 다른 경로로 이미 들어온 항목과 중복 방지)
  var pPages = await getAllPages(PLAN_DB_ID, token);
  var existing = [];
  for(const pg of pPages){ existing.push(await parseWorkPage(pg, token, true)); }
  var byGcalId = {}, byDateTitle = {};
  existing.forEach(function(p){
    if(p.gcal_id) byGcalId[p.gcal_id] = p;
    var key = (p.date||"") + "|" + (p.title||"").trim();
    if(!byDateTitle[key]) byDateTitle[key] = p;
  });

  for(const ev of events){
    result.checked++;
    var evTime = (ev.time||"").split("~")[0].trim(); // 종료시간은 저장하지 않음(시작시간만)
    var matched = byGcalId[ev.id];
    if(!matched){
      // 캘린더ID로 못 찾으면 (날짜+제목)으로도 확인 — 같은 일정이 중복 생성되는 것을 막음
      var dtKey = (ev.start||"") + "|" + (ev.title||"").trim();
      matched = byDateTitle[dtKey];
    }
    if(matched){
      // 이미 있는 항목 → 날짜·시간·제목만 갱신 (장소·내용·참석자는 노션 값 유지), 캘린더ID/과제 비어있으면 이번에 채움
      var props = {};
      if(ev.start && ev.start !== matched.date) props["날짜"] = { date: { start: ev.start } };
      if(evTime !== (matched.time||"")) props["시간"] = { rich_text: rt(evTime) };
      if(ev.title && ev.title !== matched.title) props["제목"] = { title: rt(ev.title) };
      if(!matched.gcal_id) props["캘린더ID"] = { rich_text: rt(ev.id) };
      if((!matched.project || matched.project==="기타") && ev.project && ev.project!=="기타") props["과제"] = { select: { name: ev.project } };
      if(Object.keys(props).length){
        await notionFetch("/pages/" + matched.id, token, "PATCH", { properties: props });
        result.updated++;
      }
    } else {
      // 캘린더에는 있는데 노션엔 정말 없는 일정 → 새 업무계획으로 가져오기
      var item = {
        title: ev.title || "(제목 없음)", date: ev.start, time: evTime,
        project: ev.project || "기타", location: ev.location || "", content: "", attendees: ev.attendees || "",
        week: wk.planLabel
      };
      var props2 = {
        "제목": { title: rt(item.title) }, "날짜": { date: { start: item.date } },
        "시간": { rich_text: rt(item.time) }, "참석자": { rich_text: rt(item.attendees) },
        "일시장소": { rich_text: rt(item.location) }, "내용": { rich_text: rt(item.content) },
        "출처주차": { rich_text: rt(item.week) }, "과제": { select: { name: item.project } },
        "상태": { select: { name: "예정" } }, "캘린더ID": { rich_text: rt(ev.id) },
      };
      await notionFetch("/pages", token, "POST", { parent:{ database_id: PLAN_DB_ID }, properties: props2, children: buildBodyBlocks(item) });
      result.imported++;
    }
  }
  return result;
}



function buildBodyBlocks(item){
  // 본문 템플릿: 제목 / 일시·장소 / 내용 / 참석자
  function heading(t){ return { object:"block", type:"heading_3", heading_3:{ rich_text: rt(t) } }; }
  function para(t){ return { object:"block", type:"paragraph", paragraph:{ rich_text: rt(t) } }; }
  return [
    heading("일시·장소"), para(item.location || ""),
    heading("내용"),     para(item.content || ""),
    heading("참석자"),   para(item.attendees || ""),
  ];
}

async function queryExisting(dbId, token, week){
  // 같은 출처주차의 기존 항목 (중복 방지용) → {제목|날짜: true} 맵
  const body = { page_size: 100, filter: { property:"출처주차", rich_text:{ equals: week } } };
  const data = await notionFetch("/databases/" + dbId + "/query", token, "POST", body);
  const seen = {};
  (data.results||[]).forEach(function(pg){
    const p = pg.properties || {};
    const title = ((p["제목"]&&p["제목"].title)||[]).map(function(t){return t.plain_text;}).join("");
    const date = (p["날짜"]&&p["날짜"].date&&p["날짜"].date.start) || "";
    seen[date + "|" + title] = true;
  });
  return seen;
}

async function createWorkPage(dbId, token, item, isPlan, env){
  const props = {
    "제목":   { title: rt(item.title) },
    "날짜":   { date: { start: item.date } },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "출처주차": { rich_text: rt(item.week || "") },
  };
  props["과제"] = { select: { name: item.project || "기타" } };
  if(isPlan){
    props["상태"] = { select: { name: "예정" } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
  }
  const body = { parent: { database_id: dbId }, properties: props, children: buildBodyBlocks(item) };
  const res = await notionFetch("/pages", token, "POST", body);
  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return res;
}

async function saveWork(env, payload){
  const token = env.NOTION_TOKEN;
  const achieveWeek = payload.achieveWeek || payload.week || "";
  const planWeek = payload.planWeek || payload.week || "";
  const result = { achieve_saved:0, achieve_skipped:0, plan_saved:0, plan_skipped:0 };

  // 업무실적
  const seenA = await queryExisting(ACHIEVE_DB_ID, token, achieveWeek);
  for(const it of (payload.achievements||[])){
    it.week = achieveWeek;
    if(seenA[it.date + "|" + it.title]){ result.achieve_skipped++; continue; }
    await createWorkPage(ACHIEVE_DB_ID, token, it, false, env);
    result.achieve_saved++;
  }
  // 업무계획
  const seenP = await queryExisting(PLAN_DB_ID, token, planWeek);
  for(const it of (payload.plans||[])){
    it.week = planWeek;
    if(seenP[it.date + "|" + it.title]){ result.plan_skipped++; continue; }
    await createWorkPage(PLAN_DB_ID, token, it, true, env);
    result.plan_saved++;
  }
  return result;
}

// 기존 페이지 본문 블록 전부 삭제 후 새 본문으로 교체
async function replaceBody(pageId, token, item){
  // 기존 자식 블록 조회
  const cur = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  for(const b of (cur.results||[])){
    try { await notionFetch("/blocks/" + b.id, token, "DELETE"); } catch(e){}
  }
  // 새 본문 추가
  await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: buildBodyBlocks(item) });
}

async function updateWork(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  const isPlan = !!payload.isPlan;
  if(!item.id) throw new Error("page id 없음");

  var now = payload.now || "";  // 클라이언트가 넘겨준 수정일시 문자열

  const props = {
    "제목":   { title: rt(item.title || "") },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "수정일시": { rich_text: rt(now) },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.date) props["날짜"] = { date: { start: item.date, end: item.dateEnd || null } };

  if(isPlan){
    // 업무계획 상태 로직:
    //  - 사용자가 드롭다운에서 상태를 명시적으로 바꿨으면(statusChanged) 그 값
    //  - 아니면 자동: 완료였으면 재수정 → 수정됨, 그 외 → 완료
    var newStatus;
    if(item.statusChanged && item.status){
      newStatus = item.status;
    } else {
      var prev = item.prevStatus || "";
      newStatus = (prev==="완료" || prev==="수정됨") ? "수정됨" : "완료";
    }
    props["상태"] = { select: { name: newStatus } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
    props["수정됨"] = { checkbox: (newStatus==="수정됨") };
  } else {
    // 업무실적: 수정하면 무조건 수정됨=true + 수정일시.
    //  - 드롭다운에서 삭제필요 고르면 상태=삭제필요, 아니면 상태 비움
    props["상태"] = item.status ? { select: { name: item.status } } : { select: null };
    props["수정됨"] = { checkbox: true };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
  }

  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: props });

  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return { updated: true };
}

// 항목 생성 (모달에서 + 항목 추가)
async function createWork(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  const isPlan = !!payload.isPlan;
  const dbId = isPlan ? PLAN_DB_ID : ACHIEVE_DB_ID;

  const props = {
    "제목":   { title: rt(item.title || "") },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "출처주차": { rich_text: rt(item.week || "") },
    "수정일시": { rich_text: rt(item.now || "") },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.date) props["날짜"] = { date: { start: item.date, end: item.dateEnd || null } };
  if(isPlan){
    // 업무계획 추가 → 자동 "완료" (사용자가 삭제필요 아닌 다른 상태 명시하면 존중)
    var planStatus = (item.status && item.status!=="예정") ? item.status : "완료";
    props["상태"] = { select: { name: planStatus } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
    if(item.writer) props["수정자"] = { rich_text: rt(item.writer) };
  } else {
    // 업무실적 추가 → 자동 "수정됨" (삭제필요 명시하면 그 값도 함께)
    if(item.status==="삭제필요") props["상태"] = { select: { name: "삭제필요" } };
    props["수정됨"] = { checkbox: true };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
  }
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: dbId }, properties: props });

  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return { created: true, id: res.id };
}

// 항목 삭제 (노션 휴지통으로)
async function deleteWork(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 성과 관리 CRUD =====
function perfProps(item){
  var props = {
    "성과명": { title: rt(item.name || "") },
    "세부내용": { rich_text: rt(item.detail || "") },
    "체크리스트": { rich_text: rt(item.checklist || "") },
    "진행률": { number: (typeof item.progress === "number" ? item.progress : 0) },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.type) props["구분"] = { select: { name: item.type } };
  if(item.owner) props["담당자"] = { select: { name: item.owner } };
  if(item.status) props["상태"] = { select: { name: item.status } };
  if(item.due) props["기한"] = { date: { start: item.due } };
  else props["기한"] = { date: null };
  if(typeof item.start_year === "number") props["시작연도"] = { number: item.start_year };
  else props["시작연도"] = { number: null };
  return props;
}
async function createPerf(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: PERF_DB_ID }, properties: perfProps(item) });
  return { created: true, id: res.id };
}
async function updatePerf(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: perfProps(item) });
  return { updated: true };
}
async function deletePerf(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 일정관리 CRUD (두레이) =====
// item: { id?, type, person, title, project, vacation, start, end, time('HH:MM' or 'HH:MM~HH:MM'), location }
function schedSummary(item){
  if(SCHED_ATT_TYPES.indexOf(item.type) >= 0){
    // 휴가/오전반차/오후반차/병가/공가/건강검진/외출 → "유형(이름)" 고정 규칙
    var label = (item.type === "휴가" && item.vacation) ? item.vacation : item.type;
    return label + "(" + (item.person || "") + ")";
  }
  if(item.type === "출장"){
    // 출장도 제목 끝에 "(이름)"을 자동으로 붙여서 저장 → 재조회 시 오버라이드 없이 제목만으로 출장/담당자 인식 가능
    // (두레이는 설명란을 다시 읽어올 수 없어서, 이름이 제목에 없으면 새로고침 후 유형을 잃어버림)
    var base = (item.title || "출장").trim();
    var names = (item.attendees || item.person || "").trim();
    return names ? (base + "(" + names + ")") : base;
  }
  return item.title || "(제목 없음)"; // 과제·기타는 자유 제목
}
function schedDescription(item){
  var lines = [];
  if(item.type === "출장") lines.push("출장"); // 필수 키워드
  if((item.type === "과제" || item.type === "출장") && item.project) lines.push("과제: " + item.project);
  // 휴가/외출 등은 제목의 "유형(이름)"이 담당자의 유일한 출처 → 설명란에 중복 기록하지 않음
  if(item.person && SCHED_ATT_TYPES.indexOf(item.type) < 0) lines.push("담당자: " + item.person);
  if(item.attendees) lines.push("참석자: " + item.attendees);
  if(item.title && SCHED_ATT_TYPES.indexOf(item.type) >= 0) lines.push(item.title); // 휴가류 비고
  return lines.join("\n");
}
function schedTimeRange(item){
  // "HH:MM" 또는 "HH:MM~HH:MM" → {start,end} (end 없으면 start+1h)
  var t = (item.time || "").split("~");
  var t0 = (t[0] || "").trim(), t1 = (t[1] || "").trim();
  if(!t0) return null;
  return { start: t0, end: t1 || null };
}
// 두레이 일정 생성/수정 시 "참석자(users.to)"는 필수 필드라 화면에서 안 고르게 하고 고정 시스템 계정으로 자동 채움
// (실제 담당자는 어차피 제목의 "유형(이름)" 표기가 유일한 출처라 참석자 지정은 의미 없음 - API 필수조건 맞추기용)
const DOORAY_DEFAULT_ATTENDEE_ID = "4180547016341419629"; // 한효림
function doorayEventBody(item){
  var body = {
    users: { to: [{ type:"member", member:{ organizationMemberId: DOORAY_DEFAULT_ATTENDEE_ID } }] },
    subject: schedSummary(item),
    body: { mimeType: "text/plain", content: schedDescription(item) || "" }, // body도 필수 필드(빈 값이라도 구조는 있어야 함)
    location: item.location || "",
  };
  var tr = schedTimeRange(item);
  var endDate = (item.end && item.end >= item.start) ? item.end : item.start;
  if(tr){
    var hh = ("0"+tr.start.split(":")[0]).slice(-2), mm = tr.start.split(":")[1];
    var startISO = item.start + "T" + hh + ":" + mm + ":00+09:00";
    var endISO;
    if(tr.end){
      var eh=("0"+tr.end.split(":")[0]).slice(-2), em=tr.end.split(":")[1];
      endISO = endDate + "T" + eh + ":" + em + ":00+09:00";
    } else {
      var endH = (parseInt(hh,10)+1)%24;
      endISO = endDate + "T" + ("0"+endH).slice(-2) + ":" + mm + ":00+09:00";
    }
    body.startedAt = startISO;
    body.endedAt = endISO;
    body.wholeDayFlag = false;
  } else {
    // 종일: end는 배타적이라 하루 다음날로
    var d = new Date(endDate + "T00:00:00"); d.setDate(d.getDate()+1);
    function z(n){ return (n<10?"0":"")+n; }
    var nextDay = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
    body.startedAt = item.start + "+09:00";
    body.endedAt = nextDay + "+09:00";
    body.wholeDayFlag = true;
  }
  return body;
}
// 프론트에서 넘어오는 id는 combinedScheduleList에서 "dooray-" 접두어를 붙여둔 상태라, 실제 API 호출 전 원래 id로 복원
function stripDoorayPrefix(id){
  id = String(id||"");
  return id.indexOf("dooray-")===0 ? id.slice(7) : id;
}
async function createSchedule(env, payload){
  const item = payload.item || {};
  if(!item.start) throw new Error("시작일 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events", {
    method: "POST",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(doorayEventBody(item))
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 등록 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  var newRawId = data.result && data.result.id;
  var overrideError = null;
  // 출장은 이제 제목에 "(이름)"이 자동으로 들어가므로 오버라이드 없이도 재조회 시 인식 가능 → 과제만 저장
  if(item.type === "과제"){
    try { await upsertScheduleOverride(env, newRawId, item); } catch(e){ overrideError = String(e); }
  }
  return { created: true, id: "dooray-" + newRawId, overrideError: overrideError };
}
async function updateSchedule(env, payload){
  const item = payload.item || {};
  if(!item.id) throw new Error("event id 없음");
  if(!item.start) throw new Error("시작일 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var rawId = stripDoorayPrefix(item.id);
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events/" + encodeURIComponent(rawId), {
    method: "PUT",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(doorayEventBody(item))
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 수정 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  var overrideError = null;
  try {
    // 출장은 제목에 "(이름)"이 자동으로 들어가므로 오버라이드 불필요 → 과제만 저장, 그 외(출장 포함)는 예전 오버라이드 정리
    if(item.type === "과제") await upsertScheduleOverride(env, rawId, item);
    else await deleteScheduleOverride(env, rawId);
  } catch(e){ overrideError = String(e); }
  return { updated: true, overrideError: overrideError };
}
async function deleteSchedule(env, payload){
  if(!payload.id) throw new Error("event id 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var rawId = stripDoorayPrefix(payload.id);
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events/" + encodeURIComponent(rawId) + "/delete", {
    method: "POST",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ deleteType: "this" })
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 삭제 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  try { await deleteScheduleOverride(env, rawId); } catch(e){ /* 무시 */ }
  return { deleted: true };
}



// 코멘트 추가 → 코멘트 DB에 새 행 + 회의자료 코멘트수 +1
// 진짜 노션 댓글(페이지 Discussion)로도 남겨서 노션 알림이 가게 함.
// 실패해도(권한 등) 우리 앱의 코멘트 저장/표시엔 영향 없도록 항상 try/catch로 감싸서 호출할 것.
async function postNotionComment(env, pageId, text, author){
  const token = env.NOTION_TOKEN;
  const content = (author ? author + ": " : "") + text;
  try {
    // 이 페이지에 기존 디스커션이 있으면 거기에 답글로, 없으면 새 디스커션 시작
    const existing = await notionFetch("/comments?block_id=" + pageId, token, "GET");
    const discussionId = (existing.results && existing.results[0] && existing.results[0].discussion_id) || null;
    const body = discussionId
      ? { discussion_id: discussionId, rich_text: rt(content) }
      : { parent: { page_id: pageId }, rich_text: rt(content) };
    await notionFetch("/comments", token, "POST", body);
    return true;
  } catch(e){
    return false;
  }
}

async function addComment(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const text = payload.text || "";
  const author = payload.author || "";
  if(!meetingId || !text) throw new Error("내용/회의자료 누락");

  await notionFetch("/pages", token, "POST", {
    parent: { database_id: COMMENT_DB_ID },
    properties: {
      "코멘트": { title: rt(text) },
      "회의자료": { relation: [{ id: meetingId }] },
      "작성자": author ? { select: { name: author } } : undefined,
    }
  });

  // 코멘트수 갱신 (현재 개수 다시 세서 기록)
  try {
    const q = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST",
      { filter: { property: "회의자료", relation: { contains: meetingId } } });
    const cnt = (q.results||[]).length;
    await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "코멘트수": { number: cnt } } });
  } catch(e){}
  return { added: true };
}

// 코멘트 삭제 → 노션 휴지통으로(archived) + 회의자료 코멘트수 갱신
async function deleteComment(env, payload){
  const token = env.NOTION_TOKEN;
  const commentId = payload.commentId;
  const meetingId = payload.meetingId;
  if(!commentId) throw new Error("코멘트 id 누락");

  await notionFetch("/pages/" + commentId, token, "PATCH", { archived: true });

  // 코멘트수 갱신
  if(meetingId){
    try {
      const q = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST",
        { filter: { property: "회의자료", relation: { contains: meetingId } } });
      const cnt = (q.results||[]).length;
      await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "코멘트수": { number: cnt } } });
    } catch(e){}
  }
  return { deleted: true };
}

// 회의요약(진짜 요약문, 자동 덮어쓰기 없음) 수정 — 꼭지 편집(updateMeeting)과 별개
async function updateMeetingSummary(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const summary = payload.summary || "";
  if(!meetingId) throw new Error("회의자료 id 누락");
  await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "회의요약": { rich_text: rt(summary) } } });
  return { updated: true };
}

// 결정사항(전용 필드, 회의요약과 동일한 방식 — 자동 덮어쓰기 없음) 수정
async function updateMeetingDecision(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const decision = payload.decision || "";
  if(!meetingId) throw new Error("회의자료 id 누락");
  await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "결정사항": { rich_text: rt(decision) } } });
  return { updated: true };
}

// 회의 기본 정보(과제/구분/일시/장소/참석자) 수정 — 요약·내용 수정과는 별개
async function updateMeetingInfo(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("회의자료 id 누락");
  const props = {
    "구분": { select: { name: item.kind || "주간회의" } },
    "시간": { rich_text: rt(item.time || "") },
    "장소": { rich_text: rt(item.place || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
  };
  if(item.date) props["회의날짜"] = { date: { start: item.date } };
  props["과제"] = item.project ? { select: { name: item.project } } : { select: null };
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: props });
  return { updated: true };
}

// 회의자료 삭제 — 딸린 코멘트도 같이 정리(휴지통으로)
async function deleteMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  if(!meetingId) throw new Error("회의자료 id 누락");
  try {
    const comments = await getComments(meetingId, token);
    for(const c of comments){ try { await notionFetch("/pages/" + c.id, token, "PATCH", { archived: true }); } catch(e){} }
  } catch(e){}
  await notionFetch("/pages/" + meetingId, token, "PATCH", { archived: true });
  return { deleted: true };
}

// 페이지 안에서 새 회의 등록 (기존엔 PDF 업로드 skill로만 생성 가능했음)
function weekLabelForDate(dateStr){
  var d = new Date(dateStr+"T00:00:00");
  var dow = d.getDay();
  var monOffset = (dow===0)?-6:(1-dow);
  var mon = new Date(d); mon.setDate(d.getDate()+monOffset);
  var fri = new Date(mon); fri.setDate(mon.getDate()+4);
  var aStart = ymdOf(mon), aEnd = ymdOf(fri);
  var wn = isoWeekNumSrv(aStart)-1;
  return aStart+" ~ "+aEnd.slice(5)+" ("+wn+"주차)";
}
async function createMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.title) throw new Error("제목을 입력하세요");
  if(!item.date) throw new Error("회의날짜를 입력하세요");
  var week = "";
  try { week = weekLabelForDate(item.date); } catch(e){}
  const props = {
    "제목": { title: rt(item.title) },
    "구분": { select: { name: item.kind || "주간회의" } },
    "회의날짜": { date: { start: item.date } },
    "주차": { rich_text: rt(week) },
    "작성자": { rich_text: rt(item.writer || "") },
    "시간": { rich_text: rt(item.time || "") },
    "장소": { rich_text: rt(item.place || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "회의요약": { rich_text: rt(item.summary || "") },
    "결정사항": { rich_text: rt(item.decision || "") },
  };
  props["과제"] = item.project ? { select: { name: item.project } } : { select: null };

  const sections = item.sections || [];
  const children = [];
  sections.forEach(function(s){
    children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(s.heading||"") } });
    children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(s.body||"") } });
  });
  const body = { parent: { database_id: MEETING_DB_ID }, properties: props };
  if(children.length) body.children = children;
  const res = await notionFetch("/pages", token, "POST", body);

  if(sections.length){
    try {
      const summaryText = sections.map(function(s){ return s.heading; }).filter(Boolean).join(" / ");
      await notionFetch("/pages/" + res.id, token, "PATCH", { properties: { "요약": { rich_text: rt(summaryText) } } });
    } catch(e){}
  }
  return { created: true, id: res.id };
}

// 회의자료 꼭지(본문) 수정 — 본문 전체를 새 섹션으로 교체
// 회의자료 꼭지(본문) 수정 — 기존 블록을 "그 자리에서" 내용만 교체(Q&A 저장 방식과 동일).
// 절대 전체 삭제 후 재생성하지 않음 — 그러면 사이에 있는 이미지 블록이 통째로 날아감.
async function updateMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const list = payload.sections || []; // [{heading, body}]
  if(!meetingId) throw new Error("회의자료 id 누락");

  const sections = await getOrderedMeetingSections(meetingId, token);
  const n = Math.min(sections.length, list.length);
  for(let i=0;i<n;i++){
    const sec = sections[i], item = list[i];
    var headingPatch = {}; headingPatch[sec.headingType] = { rich_text: rt(item.heading||"") };
    await notionFetch("/blocks/" + sec.headingId, token, "PATCH", headingPatch);
    if(sec.paragraphId){
      var bodyPatch = {}; bodyPatch[sec.paragraphType] = { rich_text: rt(item.body||"") };
      await notionFetch("/blocks/" + sec.paragraphId, token, "PATCH", bodyPatch);
    } else {
      await notionFetch("/blocks/" + meetingId + "/children", token, "PATCH", { children: [{ object:"block", type:"paragraph", paragraph:{ rich_text: rt(item.body||"") } }], after: sec.headingId });
    }
    // 본문이 여러 블록으로 나뉘어 있었으면(수동 편집 등) 첫 블록에 전체를 담았으니 나머지는 정리
    for(const extraId of (sec.extraBodyIds||[])){ try { await notionFetch("/blocks/" + extraId, token, "DELETE"); } catch(e){} }
  }
  // 삭제된 꼭지(사용자가 아젠다 자체를 지운 경우) — 그 꼭지의 이미지까지 함께 제거. 병렬 처리로 속도 개선.
  if(sections.length > list.length){
    var toDelete = [];
    for(let i=list.length; i<sections.length; i++){
      const sec = sections[i];
      toDelete.push(sec.headingId);
      if(sec.paragraphId) toDelete.push(sec.paragraphId);
      toDelete = toDelete.concat(sec.extraBodyIds||[], sec.imageIds||[]);
    }
    await Promise.allSettled(toDelete.map(function(id){ return notionFetch("/blocks/" + id, token, "DELETE"); }));
  }
  // 새로 추가된 꼭지(기존보다 많아진 만큼) — 맨 뒤에 덧붙임
  if(list.length > sections.length){
    const children = [];
    for(let i=sections.length; i<list.length; i++){
      children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(list[i].heading||"") } });
      children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(list[i].body||"") } });
    }
    if(children.length) await notionFetch("/blocks/" + meetingId + "/children", token, "PATCH", { children: children });
  }
  // 요약 속성도 꼭지 제목 나열로 동기화 (개요 표에 표시되는 값)
  try {
    const summaryText = list.map(function(s){ return s.heading; }).filter(Boolean).join(" / ");
    await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "요약": { rich_text: rt(summaryText) } } });
  } catch(e){}
  return { updated: true };
}

// ===== 위탁과제 회의록 CRUD =====
function consignMeetingProps(item){
  return {
    "제목": { title: rt(item.title || "") },
    "과제": { relation: [{ id: item.project }] },
    "구분": { select: { name: item.kind || "월간회의" } },
    "상태": { select: { name: item.status || "예정" } },
    "형태": { select: { name: item.mode || "대면" } },
    "일시": item.date ? { date: { start: item.date } } : { date: null },
    "참석": { rich_text: rt(item.attendees || "") },
    "내용": { rich_text: rt(item.body || "") },
  };
}
async function createConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.project) throw new Error("과제(project) 누락");
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: CONSIGN_MEETING_DB_ID }, properties: consignMeetingProps(item) });
  return { created: true, id: res.id };
}
async function updateConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: consignMeetingProps(item) });
  return { updated: true };
}
async function deleteConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 위탁과제 요청자료 CRUD (Q&A는 본문 블록으로 저장) =====
function consignRequestProps(item){
  return {
    "제목": { title: rt(item.title || "") },
    "과제": { relation: [{ id: item.project }] },
    "구분": { select: { name: item.category || "기타" } },
    "상태": { select: { name: item.status || "검토중" } },
    "요청일": item.reqDate ? { date: { start: item.reqDate } } : { date: null },
    "회신일": item.replyDate ? { date: { start: item.replyDate } } : { date: null },
    "요청파일명": { rich_text: rt(item.reqFile || "") },
    "회신파일명": { rich_text: rt(item.replyFile || "") },
  };
}
// 현재 본문을 "꼭지 단위"(heading + 그 뒤 첫 paragraph + 그 뒤 image들)로 순서대로 묶어서 반환
async function getOrderedQaSections(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = []; let cur = null;
  const BODY_TYPES = ["paragraph","bulleted_list_item","numbered_list_item","quote","callout"];
  for(const b of (data.results || [])){
    const t = b.type;
    if(t && t.startsWith("heading")){
      cur = { headingId: b.id, headingType: t, paragraphId: null, paragraphType: "paragraph", extraBodyIds: [], imageIds: [] };
      sections.push(cur);
    } else if(cur){
      if(BODY_TYPES.indexOf(t) >= 0){
        // 답변이 노션에서 여러 문단(블록)으로 나뉘어 있을 수 있음(Enter로 줄바꿈한 경우) — 전부 추적해야 저장 시 안 남고 지워짐
        if(cur.paragraphId === null){ cur.paragraphId = b.id; cur.paragraphType = t; }
        else cur.extraBodyIds.push(b.id);
      }
      else if(t === "image") cur.imageIds.push(b.id);
    }
  }
  return sections;
}

// Q&A 저장: 기존 꼭지(질문/답변)는 그 블록을 "그 자리에서" 내용만 교체 → 사이에 있는 이미지 블록은 절대 안 건드림.
// 답변이 여러 문단(블록)으로 나뉘어 있었으면 첫 블록에 전체 내용을 담고 나머지 옛 블록은 삭제(안 그러면 옛 내용이 남아서 뒤섞임).
// 새로 추가된 항목은 맨 뒤에 덧붙이고, 삭제된 항목은 그 항목의 블록만 지움(이미지 포함).
async function writeRequestQaBlocks(pageId, token, qa){
  const list = qa || [];
  const sections = await getOrderedQaSections(pageId, token);
  const n = Math.min(sections.length, list.length);
  for(let i=0;i<n;i++){
    const sec = sections[i], item = list[i];
    // 실제 블록 타입(heading_1/2/3 등)에 맞춰 패치해야 함 — 타입을 강제로 바꾸는 건 노션이 거부함
    var headingPatch = {}; headingPatch[sec.headingType] = { rich_text: rt(item.q||"") };
    await notionFetch("/blocks/" + sec.headingId, token, "PATCH", headingPatch);
    if(sec.paragraphId){
      var bodyPatch = {}; bodyPatch[sec.paragraphType] = { rich_text: rt(item.a||"") };
      await notionFetch("/blocks/" + sec.paragraphId, token, "PATCH", bodyPatch);
    } else {
      await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: [{ object:"block", type:"paragraph", paragraph:{ rich_text: rt(item.a||"") } }], after: sec.headingId });
    }
    // 답변이 여러 블록으로 나뉘어 있었다면, 첫 블록에 전체 내용을 넣었으니 나머지는 삭제(안 그러면 옛 내용이 중복으로 남음)
    for(const extraId of (sec.extraBodyIds||[])){ try { await notionFetch("/blocks/" + extraId, token, "DELETE"); } catch(e){} }
  }
  // 삭제된 항목(뒤쪽 남는 기존 섹션) 제거 — 이미지도 그 섹션 것만 같이 지움
  for(let i=list.length; i<sections.length; i++){
    const sec = sections[i];
    try { await notionFetch("/blocks/" + sec.headingId, token, "DELETE"); } catch(e){}
    if(sec.paragraphId){ try { await notionFetch("/blocks/" + sec.paragraphId, token, "DELETE"); } catch(e){} }
    for(const extraId of (sec.extraBodyIds||[])){ try { await notionFetch("/blocks/" + extraId, token, "DELETE"); } catch(e){} }
    for(const imgId of sec.imageIds){ try { await notionFetch("/blocks/" + imgId, token, "DELETE"); } catch(e){} }
  }
  // 새로 추가된 항목(기존보다 많아진 만큼) — 맨 뒤에 덧붙임
  if(list.length > sections.length){
    const children = [];
    for(let i=sections.length; i<list.length; i++){
      children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(list[i].q||"") } });
      children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(list[i].a||"") } });
    }
    if(children.length) await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: children });
  }
}
// ===== 노션 파일 업로드 API (Ctrl+V로 붙여넣은 그림을 요청자료 안건에 실제로 첨부) =====
// 파일 업로드 API는 기존 NOTION_VERSION(2022-06-28)보다 최근 버전이 필요해서 이 두 함수만 별도 버전 사용
const NOTION_UPLOAD_VERSION = "2026-03-11";
async function notionFileUploadCreate(token, filename, contentType){
  const res = await fetch("https://api.notion.com/v1/file_uploads", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json", "Notion-Version": NOTION_UPLOAD_VERSION },
    body: JSON.stringify({ filename: filename, content_type: contentType })
  });
  const data = await res.json();
  if(!data.id) throw new Error("파일 업로드 객체 생성 실패: " + JSON.stringify(data));
  return data; // { id, upload_url, ... }
}
async function notionFileUploadSend(token, uploadId, base64, filename, mimeType){
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type: mimeType || "application/octet-stream" });
  const form = new FormData();
  form.append("file", blob, filename || "image.png");
  const res = await fetch("https://api.notion.com/v1/file_uploads/" + uploadId + "/send", {
    method: "POST",
    headers: { "Authorization": "Bearer " + token, "Notion-Version": NOTION_UPLOAD_VERSION },
    body: form
  });
  const data = await res.json();
  if(data.status !== "uploaded") throw new Error("파일 전송 실패: " + JSON.stringify(data));
  return data;
}
// 답변란에 Ctrl+V로 붙여넣은 그림 하나를 실제로 노션에 업로드하고, 해당 안건(qaIndex) 바로 아래에 이미지 블록으로 붙임
async function consignRequestAddImage(env, payload){
  const token = env.NOTION_TOKEN;
  const pageId = payload.pageId;
  const qaIndex = payload.qaIndex;
  if(!pageId) throw new Error("pageId 누락");
  if(qaIndex === undefined || qaIndex === null) throw new Error("qaIndex 누락");
  if(!payload.imageBase64) throw new Error("imageBase64 누락");

  const created = await notionFileUploadCreate(token, payload.filename || "image.png", payload.mimeType || "image/png");
  await notionFileUploadSend(token, created.id, payload.imageBase64, payload.filename || "image.png", payload.mimeType || "image/png");

  const sections = await getOrderedQaSections(pageId, token);
  const sec = sections[qaIndex];
  if(!sec) throw new Error("해당 안건(qaIndex=" + qaIndex + ")을 찾을 수 없습니다");
  // 그 안건의 마지막 블록(이미지 > 추가답변 > 답변 > 제목 순으로 있는 것) 바로 뒤에 새 이미지를 붙임
  const anchorId = (sec.imageIds && sec.imageIds.length) ? sec.imageIds[sec.imageIds.length-1]
    : (sec.extraBodyIds && sec.extraBodyIds.length) ? sec.extraBodyIds[sec.extraBodyIds.length-1]
    : (sec.paragraphId || sec.headingId);

  // "after" 파라미터는 최신 버전(NOTION_UPLOAD_VERSION)에서는 거부돼서, 이 요청만 예전 안정 버전으로 보냄
  // (file_upload 참조 자체는 이미 생성된 파일을 가리키기만 하면 되므로 버전 상관없이 인식됨)
  const appendRes = await fetch("https://api.notion.com/v1/blocks/" + pageId + "/children", {
    method: "PATCH",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json", "Notion-Version": NOTION_VERSION },
    body: JSON.stringify({
      after: anchorId,
      children: [{ object:"block", type:"image", image:{ type:"file_upload", file_upload:{ id: created.id } } }]
    })
  });
  if(!appendRes.ok){ const t = await appendRes.text(); throw new Error("이미지 블록 추가 실패: " + appendRes.status + " " + t); }
  return { added: true };
}
// 회의자료 페이지의 heading_3(꼭지)+paragraph(본문) 순서를 그대로 읽어옴 — createMeeting이 만드는 구조와 1:1로 대응
async function getOrderedMeetingSections(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = []; let cur = null;
  const BODY_TYPES = ["paragraph","bulleted_list_item","numbered_list_item","quote","callout"];
  for(const b of (data.results || [])){
    const t = b.type;
    if(t && t.startsWith("heading")){
      cur = { headingId: b.id, headingType: t, paragraphId: null, paragraphType: "paragraph", extraBodyIds: [], imageIds: [] };
      sections.push(cur);
    } else if(cur){
      if(t === "image") cur.imageIds.push(b.id);
      else if(BODY_TYPES.indexOf(t) >= 0){
        if(cur.paragraphId === null){ cur.paragraphId = b.id; cur.paragraphType = t; }
        else cur.extraBodyIds.push(b.id);
      }
    }
  }
  return sections;
}
// PDF에서 크롭한 표/그림 이미지를 지정한 꼭지(sectionIndex) 바로 뒤에 붙임
// (사용자가 미리보기에서 크롭 영역을 확인/수정한 뒤 저장 시 호출 — 반자동 방식)
async function meetingAddImage(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const sectionIndex = payload.sectionIndex;
  if(!meetingId) throw new Error("meetingId 누락");
  if(!payload.imageBase64) throw new Error("imageBase64 누락");

  const created = await notionFileUploadCreate(token, payload.filename || "figure.png", payload.mimeType || "image/png");
  await notionFileUploadSend(token, created.id, payload.imageBase64, payload.filename || "figure.png", payload.mimeType || "image/png");

  const sections = await getOrderedMeetingSections(meetingId, token);
  const sec = (typeof sectionIndex === "number") ? sections[sectionIndex] : null;
  // 대상 꼭지를 못 찾으면(예: 저장 전에 아젠다를 수정해서 순서가 바뀐 경우) 페이지 맨 끝에 덧붙임
  const anchorId = sec ? (sec.imageIds.length ? sec.imageIds[sec.imageIds.length-1] : (sec.paragraphId || sec.headingId)) : null;

  const body = { children: [{ object:"block", type:"image", image:{ type:"file_upload", file_upload:{ id: created.id } } }] };
  if(anchorId) body.after = anchorId;
  // "after" 파라미터는 최신 업로드 버전에서 거부돼서 안정 버전(NOTION_VERSION)으로 별도 호출
  const appendRes = await fetch("https://api.notion.com/v1/blocks/" + meetingId + "/children", {
    method: "PATCH",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json", "Notion-Version": NOTION_VERSION },
    body: JSON.stringify(body)
  });
  if(!appendRes.ok){ const t = await appendRes.text(); throw new Error("이미지 블록 추가 실패: " + appendRes.status + " " + t); }
  return { added: true };
}

async function createConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.project) throw new Error("과제(project) 누락");
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: CONSIGN_REQUEST_DB_ID }, properties: consignRequestProps(item) });
  await writeRequestQaBlocks(res.id, token, item.qa);
  return { created: true, id: res.id };
}
async function updateConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: consignRequestProps(item) });
  await writeRequestQaBlocks(item.id, token, item.qa);
  return { updated: true };
}
async function deleteConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

export default {
  async fetch(request, env){
    if(request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });

    // POST = 저장 또는 수정 요청
    if(request.method === "POST"){
      try {
        const payload = await request.json();
        let result;
        if(payload.action === "update"){
          result = await updateWork(env, payload);
        } else if(payload.action === "create"){
          result = await createWork(env, payload);
        } else if(payload.action === "delete"){
          result = await deleteWork(env, payload);
        } else if(payload.action === "syncPlans"){
          result = await syncPlansFromCalendar(env);
        } else if(payload.action === "perfCreate"){
          result = await createPerf(env, payload);
        } else if(payload.action === "perfUpdate"){
          result = await updatePerf(env, payload);
        } else if(payload.action === "perfDelete"){
          result = await deletePerf(env, payload);
        } else if(payload.action === "schedCreate"){
          result = await createSchedule(env, payload);
        } else if(payload.action === "schedUpdate"){
          result = await updateSchedule(env, payload);
        } else if(payload.action === "schedDelete"){
          result = await deleteSchedule(env, payload);
        } else if(payload.action === "archiveScheduleNow"){
          result = await archiveYesterdaySchedule(env); // 크론 기다리지 않고 수동 테스트용
        } else if(payload.action === "archiveBackfill"){
          if(!payload.from || !payload.to) throw new Error("from/to 날짜(YYYY-MM-DD)가 필요합니다");
          result = await archiveDateRange(env, payload.from, payload.to); // 과거 데이터 한 번에 몰아서 채우기
        } else if(payload.action === "archiveDay"){
          if(!payload.day) throw new Error("day 날짜(YYYY-MM-DD)가 필요합니다");
          result = await archiveOneDay(env, payload.day); // 하루씩 백필(서브요청 한도 안전)
        } else if(payload.action === "login"){
          result = await checkLogin(env, payload);
        } else if(payload.action === "comment"){
          result = await addComment(env, payload);
        } else if(payload.action === "deleteComment"){
          result = await deleteComment(env, payload);
        } else if(payload.action === "meetingCreate"){
          result = await createMeeting(env, payload);
        } else if(payload.action === "updateMeeting"){
          result = await updateMeeting(env, payload);
        } else if(payload.action === "updateMeetingSummary"){
          result = await updateMeetingSummary(env, payload);
        } else if(payload.action === "updateMeetingDecision"){
          result = await updateMeetingDecision(env, payload);
        } else if(payload.action === "updateMeetingInfo"){
          result = await updateMeetingInfo(env, payload);
        } else if(payload.action === "meetingDelete"){
          result = await deleteMeeting(env, payload);
        } else if(payload.action === "meetingAddImage"){
          result = await meetingAddImage(env, payload);
        } else if(payload.action === "consignMeetingCreate"){
          result = await createConsignMeeting(env, payload);
        } else if(payload.action === "consignMeetingUpdate"){
          result = await updateConsignMeeting(env, payload);
        } else if(payload.action === "consignMeetingDelete"){
          result = await deleteConsignMeeting(env, payload);
        } else if(payload.action === "consignRequestCreate"){
          result = await createConsignRequest(env, payload);
        } else if(payload.action === "consignRequestAddImage"){
          result = await consignRequestAddImage(env, payload);
        } else if(payload.action === "downloadHwpx"){
          const wkR = currentWeekRange(payload.weekOffset || 0);
          const hwpxBytes = await generateWeeklyHwpx(payload.achievements || [], payload.plans || [], wkR);
          result = { hwpxBase64: bytesToBase64(hwpxBytes) };
        } else if(payload.action === "consignRequestUpdate"){
          result = await updateConsignRequest(env, payload);
        } else if(payload.action === "consignRequestDelete"){
          result = await deleteConsignRequest(env, payload);
        } else {
          result = await saveWork(env, payload);
        }
        return new Response(JSON.stringify({ ok:true, result: result }), { headers: corsHeaders() });
      } catch(e){
        return new Response(JSON.stringify({ ok:false, error: String(e) }), { status:500, headers: corsHeaders() });
      }
    }

    try {
      const token = env.NOTION_TOKEN;
      if(!token) throw new Error("NOTION_TOKEN 미설정");

      var url = new URL(request.url);
      var scope = url.searchParams.get("scope") || "all";
      var want = function(k){ return scope==="all" || scope===k; };

      const body = { updated_at: new Date().toISOString() };

      if(scope === "dashboard"){
        // 대시보드 전용: 필요한 것만, 전부 병렬로 (개별 실패해도 나머지는 계속 진행)
        var wkR0 = currentWeekRange();
        // 회의 목록 + (이번주 회의 한정) 코멘트 조회를 하나의 체인으로 묶음
        // → 아래 Promise.allSettled 안에서 다른 6개 fetch와 "진짜" 동시에 돎 (예전엔 이게 밖에서 순차로 붙어서 시간이 그냥 더해졌었음)
        var meetingsPromise = getAllPages(MEETING_DB_ID, token).then(async function(pages){
          var lite = pages.map(parseMeetingLite).filter(function(m){ return m.title; });
          var thisWeek = lite.filter(function(m){ return m.date >= wkR0.start && m.date <= wkR0.end; });
          try {
            var commentResults = await Promise.allSettled(thisWeek.map(function(m){ return getComments(m.id, token); }));
            thisWeek.forEach(function(m, i){
              var comments = (commentResults[i].status==="fulfilled") ? commentResults[i].value : [];
              m.needsReview = !comments.some(function(c){ return c.author === "이숭봉"; });
            });
          } catch(e){}
          return lite;
        });

        const results = await Promise.allSettled([
          getAllPages(PROJECT_DB_ID, token),                 // 0: 과제 정보
          getAllPages(PERF_DB_ID, token),                    // 1: 성과
          getAllPages(ACHIEVE_DB_ID, token),                 // 2: 업무실적
          getAllPages(PLAN_DB_ID, token),                    // 3: 업무계획
          meetingsPromise,                                   // 4: 회의자료 + 이번주 코멘트(체인됨, 이제 진짜 병렬)
          getAllPages(CONSIGN_DB_ID, token),                 // 5: 위탁과제 정보만(회의록/요청자료는 대시보드에 안 씀)
          combinedScheduleList(env),  // 6: 일정(노션 아카이브 - 오늘 이전 + 두레이 팀 캘린더 - 오늘 이후, 병합)
        ]);
        function ok(i, map){ return results[i].status==="fulfilled" ? map(results[i].value) : []; }

        var pinfo = ok(0, function(pages){ return pages.map(parseProjectInfo).filter(function(x){return x.name;}); });
        pinfo.sort(function(a,b){ return a.order - b.order; });
        body.projectInfo = pinfo;
        if(results[0].status==="rejected") body.projectInfoError = String(results[0].reason);

        body.perf = ok(1, function(pages){ return pages.map(parsePerf).filter(function(x){return x.name;}); });

        var aAll = ok(2, function(pages){ return pages.map(parseWorkPageLite); });
        var pAll = ok(3, function(pages){ return pages.map(parseWorkPageLite); });
        var wkR = wkR0;
        var achievements = aAll.filter(function(x){return x.week===wkR.label;});
        var plans = pAll.filter(function(x){return x.week===wkR.planLabel;});
        body.work = { week: wkR.label, planWeek: wkR.planLabel, achievements: achievements, plans: plans };

        body.meetings = results[4].status==="fulfilled" ? results[4].value : [];

        var consignments = ok(5, function(pages){ return pages.map(parseConsignment).filter(function(c){return c.title;}); });
        consignments.sort(function(a,b){ return a.order - b.order; });
        body.consignments = consignments;

        var scheduleResult = results[6].status==="fulfilled" ? results[6].value : { items: [], errors: { combinedScheduleError: String(results[6].reason) } };
        body.schedule = scheduleResult.items || [];
        if(scheduleResult.errors && scheduleResult.errors.archiveScheduleError) body.archiveScheduleError = scheduleResult.errors.archiveScheduleError;
        if(scheduleResult.errors && scheduleResult.errors.doorayScheduleError) body.doorayScheduleError = scheduleResult.errors.doorayScheduleError;
        if(scheduleResult.errors && scheduleResult.errors.combinedScheduleError) body.scheduleError = scheduleResult.errors.combinedScheduleError;

        return new Response(JSON.stringify(body), { headers: corsHeaders() });
      }

      // 대시보드 팝업 전용: 회의 1건만 (본문+코멘트) 가볍게 조회 — scope=meetings(전체) 대신 사용
      if(scope === "meetingDetail"){
        const meetingId = url.searchParams.get("id");
        if(!meetingId) return new Response(JSON.stringify({ error:"id 누락" }), { status:400, headers: corsHeaders() });
        try {
          const page = await notionFetch("/pages/" + meetingId, token, "GET");
          const meeting = await parseMeeting(page, token);
          meeting.comments = await getComments(meetingId, token);
          return new Response(JSON.stringify({ meeting: meeting }), { headers: corsHeaders() });
        } catch(e){
          return new Response(JSON.stringify({ error: String(e) }), { status:500, headers: corsHeaders() });
        }
      }

      // 위탁과제 요청자료 상세(보기/수정 팝업 전용) - 1건만 가볍게 조회
      if(scope === "consignRequestDetail"){
        const reqId = url.searchParams.get("id");
        if(!reqId) return new Response(JSON.stringify({ error:"id 누락" }), { status:400, headers: corsHeaders() });
        try {
          const page = await notionFetch("/pages/" + reqId, token, "GET");
          const request = await parseConsignRequest(page, token);
          return new Response(JSON.stringify({ request: request }), { headers: corsHeaders() });
        } catch(e){
          return new Response(JSON.stringify({ error: String(e) }), { status:500, headers: corsHeaders() });
        }
      }

      // 이미지 프록시 - 노션에 올라간 그림(특히 내부 업로드 이미지의 서명된 S3 URL)은 브라우저에서 직접 fetch하면 CORS에 막혀서
      // 워커가 대신 받아와서 그대로 흘려보내줌
      if(scope === "imageProxy"){
        const imgUrl = url.searchParams.get("url");
        if(!imgUrl) return new Response("url 파라미터 누락", { status: 400 });
        try {
          const imgRes = await fetch(imgUrl);
          if(!imgRes.ok) return new Response("이미지 조회 실패: HTTP " + imgRes.status, { status: 502 });
          const contentType = imgRes.headers.get("Content-Type") || "application/octet-stream";
          return new Response(imgRes.body, {
            headers: { "Content-Type": contentType, "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" }
          });
        } catch(e){
          return new Response("프록시 오류: " + String(e), { status: 500 });
        }
      }

      if(want("perf")){
        try {
          const perfPages = await getAllPages(PERF_DB_ID, token);
          body.perf = perfPages.map(parsePerf).filter(function(x){ return x.name; });
        } catch(e){ body.perf = []; }
      }

      if(want("schedule")){
        try {
          var schedRes = await combinedScheduleList(env);
          body.schedule = schedRes.items || [];
          if(schedRes.errors && schedRes.errors.archiveScheduleError) body.archiveScheduleError = schedRes.errors.archiveScheduleError;
          if(schedRes.errors && schedRes.errors.doorayScheduleError) body.doorayScheduleError = schedRes.errors.doorayScheduleError;
        } catch(e){ body.schedule = []; body.scheduleError = String(e); }
      }

      if(want("work")){
        let achievements = [], plans = [];
        const weekOffset = parseInt(url.searchParams.get("weekOffset") || "0", 10) || 0;
        const wkR = currentWeekRange(weekOffset);
        try {
          const [aPages, pPages] = await Promise.all([
            getAllPages(ACHIEVE_DB_ID, token),
            getAllPages(PLAN_DB_ID, token),
          ]);
          const [aAll, pAll] = await Promise.all([
            Promise.all(aPages.map(function(pg){ return parseWorkPage(pg, token, false); })),
            Promise.all(pPages.map(function(pg){ return parseWorkPage(pg, token, true); })),
          ]);
          achievements = aAll.filter(function(x){ return x.week === wkR.label; });
          plans = pAll.filter(function(x){ return x.week === wkR.planLabel; });
          function srt(a,b){ if(a.date!==b.date) return a.date<b.date?-1:1; return (a.time||"")<(b.time||"")?-1:1; }
          achievements.sort(srt); plans.sort(srt);
        } catch(e){}
        body.work = { week: wkR.label, planWeek: wkR.planLabel, achievements: achievements, plans: plans };
      }

      if(want("meetings")){
        let meetings = [];
        try {
          const mPages = await getAllPages(MEETING_DB_ID, token);
          const parsed = await Promise.all(mPages.map(function(pg){ return parseMeeting(pg, token); }));
          parsed.sort(function(a,b){ return (a.date<b.date?1:-1); });
          const commentResults = await Promise.all(parsed.map(function(m){ return getComments(m.id, token); }));
          parsed.forEach(function(m, i){ m.comments = commentResults[i]; });
          meetings = parsed;
        } catch(e){ body.meetingError = String(e); }
        body.meetings = meetings;
      }

      if(want("outsourced")){
        const [cRes, cmRes, crRes] = await Promise.allSettled([
          getAllPages(CONSIGN_DB_ID, token),
          getAllPages(CONSIGN_MEETING_DB_ID, token),
          getAllPages(CONSIGN_REQUEST_DB_ID, token),
        ]);
        if(cRes.status==="fulfilled"){
          var consignments = cRes.value.map(parseConsignment).filter(function(c){ return c.title; });
          consignments.sort(function(a,b){ return a.order - b.order; });
          body.consignments = consignments;
        } else { body.consignments = []; body.consignError = String(cRes.reason); }

        if(cmRes.status==="fulfilled"){
          body.consignMeetings = cmRes.value.map(parseConsignMeeting).filter(function(m){ return m.title; });
        } else { body.consignMeetings = []; body.consignMeetingError = String(cmRes.reason); }

        if(crRes.status==="fulfilled"){
          try {
            body.consignRequests = await Promise.all(crRes.value.map(function(pg){ return parseConsignRequest(pg, token); }));
          } catch(e){ body.consignRequests = []; body.consignRequestError = String(e); }
        } else { body.consignRequests = []; body.consignRequestError = String(crRes.reason); }
      }

      return new Response(JSON.stringify(body), { headers: corsHeaders() });
    } catch(e){
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders() });
    }
  },

  // 매일 한 번(Cloudflare 대시보드에서 Cron Trigger로 등록 필요) - 어제치 두레이 일정을 노션 아카이브로 저장
  async scheduled(event, env, ctx){
    ctx.waitUntil(
      archiveYesterdaySchedule(env)
        .then(function(r){ console.log("일정 아카이브 완료:", JSON.stringify(r)); })
        .catch(function(e){ console.error("일정 아카이브 실패:", e); })
    );
  },
};