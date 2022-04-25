/*!
 * Socket.IO v4.4.0
 * (c) 2014-2021 Guillermo Rauch
 * Released under the MIT License.
 */
(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global=typeof globalThis!=='undefined'?globalThis:global||self,global.io=factory());})(this,(function(){'use strict';function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function(obj){return typeof obj;};}else{_typeof=function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};}
return _typeof(obj);}
function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}
function _createClass(Constructor,protoProps,staticProps){if(protoProps)_defineProperties(Constructor.prototype,protoProps);if(staticProps)_defineProperties(Constructor,staticProps);return Constructor;}
function _extends(){_extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}
return target;};return _extends.apply(this,arguments);}
function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function");}
subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:true,configurable:true}});if(superClass)_setPrototypeOf(subClass,superClass);}
function _getPrototypeOf(o){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o);};return _getPrototypeOf(o);}
function _setPrototypeOf(o,p){_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(o,p){o.__proto__=p;return o;};return _setPrototypeOf(o,p);}
function _isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));return true;}catch(e){return false;}}
function _assertThisInitialized(self){if(self===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}
return self;}
function _possibleConstructorReturn(self,call){if(call&&(typeof call==="object"||typeof call==="function")){return call;}else if(call!==void 0){throw new TypeError("Derived constructors may only return object or undefined");}
return _assertThisInitialized(self);}
function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var Super=_getPrototypeOf(Derived),result;if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget);}else{result=Super.apply(this,arguments);}
return _possibleConstructorReturn(this,result);};}
function _superPropBase(object,property){while(!Object.prototype.hasOwnProperty.call(object,property)){object=_getPrototypeOf(object);if(object===null)break;}
return object;}
function _get(target,property,receiver){if(typeof Reflect!=="undefined"&&Reflect.get){_get=Reflect.get;}else{_get=function _get(target,property,receiver){var base=_superPropBase(target,property);if(!base)return;var desc=Object.getOwnPropertyDescriptor(base,property);if(desc.get){return desc.get.call(receiver);}
return desc.value;};}
return _get(target,property,receiver||target);}
function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen);}
function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2;}
function _createForOfIteratorHelper(o,allowArrayLike){var it=typeof Symbol!=="undefined"&&o[Symbol.iterator]||o["@@iterator"];if(!it){if(Array.isArray(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function(){};return{s:F,n:function(){if(i>=o.length)return{done:true};return{done:false,value:o[i++]};},e:function(e){throw e;},f:F};}
throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}
var normalCompletion=true,didErr=false,err;return{s:function(){it=it.call(o);},n:function(){var step=it.next();normalCompletion=step.done;return step;},e:function(e){didErr=true;err=e;},f:function(){try{if(!normalCompletion&&it.return!=null)it.return();}finally{if(didErr)throw err;}}};}
var re=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'];var parseuri=function parseuri(str){var src=str,b=str.indexOf('['),e=str.indexOf(']');if(b!=-1&&e!=-1){str=str.substring(0,b)+str.substring(b,e).replace(/:/g,';')+str.substring(e,str.length);}
var m=re.exec(str||''),uri={},i=14;while(i--){uri[parts[i]]=m[i]||'';}
if(b!=-1&&e!=-1){uri.source=src;uri.host=uri.host.substring(1,uri.host.length-1).replace(/;/g,':');uri.authority=uri.authority.replace('[','').replace(']','').replace(/;/g,':');uri.ipv6uri=true;}
uri.pathNames=pathNames(uri,uri['path']);uri.queryKey=queryKey(uri,uri['query']);return uri;};function pathNames(obj,path){var regx=/\/{2,9}/g,names=path.replace(regx,"/").split("/");if(path.substr(0,1)=='/'||path.length===0){names.splice(0,1);}
if(path.substr(path.length-1,1)=='/'){names.splice(names.length-1,1);}
return names;}
function queryKey(uri,query){var data={};query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function($0,$1,$2){if($1){data[$1]=$2;}});return data;}
function url(uri){var path=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"";var loc=arguments.length>2?arguments[2]:undefined;var obj=uri;loc=loc||typeof location!=="undefined"&&location;if(null==uri)uri=loc.protocol+"//"+loc.host;if(typeof uri==="string"){if("/"===uri.charAt(0)){if("/"===uri.charAt(1)){uri=loc.protocol+uri;}else{uri=loc.host+uri;}}
if(!/^(https?|wss?):\/\//.test(uri)){if("undefined"!==typeof loc){uri=loc.protocol+"//"+uri;}else{uri="https://"+uri;}}
obj=parseuri(uri);}
if(!obj.port){if(/^(http|ws)$/.test(obj.protocol)){obj.port="80";}else if(/^(http|ws)s$/.test(obj.protocol)){obj.port="443";}}
obj.path=obj.path||"/";var ipv6=obj.host.indexOf(":")!==-1;var host=ipv6?"["+obj.host+"]":obj.host;obj.id=obj.protocol+"://"+host+":"+obj.port+path;obj.href=obj.protocol+"://"+host+(loc&&loc.port===obj.port?"":":"+obj.port);return obj;}
var hasCors={exports:{}};try{hasCors.exports=typeof XMLHttpRequest!=='undefined'&&'withCredentials'in new XMLHttpRequest();}catch(err){hasCors.exports=false;}
var hasCORS=hasCors.exports;var globalThis=(function(){if(typeof self!=="undefined"){return self;}else if(typeof window!=="undefined"){return window;}else{return Function("return this")();}})();function XMLHttpRequest$1(opts){var xdomain=opts.xdomain;try{if("undefined"!==typeof XMLHttpRequest&&(!xdomain||hasCORS)){return new XMLHttpRequest();}}catch(e){}
if(!xdomain){try{return new globalThis[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");}catch(e){}}}
function pick(obj){for(var _len=arguments.length,attr=new Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){attr[_key-1]=arguments[_key];}
return attr.reduce(function(acc,k){if(obj.hasOwnProperty(k)){acc[k]=obj[k];}
return acc;},{});}
var NATIVE_SET_TIMEOUT=setTimeout;var NATIVE_CLEAR_TIMEOUT=clearTimeout;function installTimerFunctions(obj,opts){if(opts.useNativeTimers){obj.setTimeoutFn=NATIVE_SET_TIMEOUT.bind(globalThis);obj.clearTimeoutFn=NATIVE_CLEAR_TIMEOUT.bind(globalThis);}else{obj.setTimeoutFn=setTimeout.bind(globalThis);obj.clearTimeoutFn=clearTimeout.bind(globalThis);}}
var Emitter_1=Emitter;function Emitter(obj){if(obj)return mixin(obj);}
function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key];}
return obj;}
Emitter.prototype.on=Emitter.prototype.addEventListener=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks['$'+event]=this._callbacks['$'+event]||[]).push(fn);return this;};Emitter.prototype.once=function(event,fn){function on(){this.off(event,on);fn.apply(this,arguments);}
on.fn=fn;this.on(event,on);return this;};Emitter.prototype.off=Emitter.prototype.removeListener=Emitter.prototype.removeAllListeners=Emitter.prototype.removeEventListener=function(event,fn){this._callbacks=this._callbacks||{};if(0==arguments.length){this._callbacks={};return this;}
var callbacks=this._callbacks['$'+event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks['$'+event];return this;}
var cb;for(var i=0;i<callbacks.length;i++){cb=callbacks[i];if(cb===fn||cb.fn===fn){callbacks.splice(i,1);break;}}
if(callbacks.length===0){delete this._callbacks['$'+event];}
return this;};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=new Array(arguments.length-1),callbacks=this._callbacks['$'+event];for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}
if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args);}}
return this;};Emitter.prototype.emitReserved=Emitter.prototype.emit;Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks['$'+event]||[];};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length;};var PACKET_TYPES=Object.create(null);PACKET_TYPES["open"]="0";PACKET_TYPES["close"]="1";PACKET_TYPES["ping"]="2";PACKET_TYPES["pong"]="3";PACKET_TYPES["message"]="4";PACKET_TYPES["upgrade"]="5";PACKET_TYPES["noop"]="6";var PACKET_TYPES_REVERSE=Object.create(null);Object.keys(PACKET_TYPES).forEach(function(key){PACKET_TYPES_REVERSE[PACKET_TYPES[key]]=key;});var ERROR_PACKET={type:"error",data:"parser error"};var withNativeBlob$1=typeof Blob==="function"||typeof Blob!=="undefined"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]";var withNativeArrayBuffer$2=typeof ArrayBuffer==="function";var isView$1=function isView(obj){return typeof ArrayBuffer.isView==="function"?ArrayBuffer.isView(obj):obj&&obj.buffer instanceof ArrayBuffer;};var encodePacket=function encodePacket(_ref,supportsBinary,callback){var type=_ref.type,data=_ref.data;if(withNativeBlob$1&&data instanceof Blob){if(supportsBinary){return callback(data);}else{return encodeBlobAsBase64(data,callback);}}else if(withNativeArrayBuffer$2&&(data instanceof ArrayBuffer||isView$1(data))){if(supportsBinary){return callback(data);}else{return encodeBlobAsBase64(new Blob([data]),callback);}}
return callback(PACKET_TYPES[type]+(data||""));};var encodeBlobAsBase64=function encodeBlobAsBase64(data,callback){var fileReader=new FileReader();fileReader.onload=function(){var content=fileReader.result.split(",")[1];callback("b"+content);};return fileReader.readAsDataURL(data);};var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';var lookup$1=typeof Uint8Array==='undefined'?[]:new Uint8Array(256);for(var i$1=0;i$1<chars.length;i$1++){lookup$1[chars.charCodeAt(i$1)]=i$1;}
var decode$1=function decode(base64){var bufferLength=base64.length*0.75,len=base64.length,i,p=0,encoded1,encoded2,encoded3,encoded4;if(base64[base64.length-1]==='='){bufferLength--;if(base64[base64.length-2]==='='){bufferLength--;}}
var arraybuffer=new ArrayBuffer(bufferLength),bytes=new Uint8Array(arraybuffer);for(i=0;i<len;i+=4){encoded1=lookup$1[base64.charCodeAt(i)];encoded2=lookup$1[base64.charCodeAt(i+1)];encoded3=lookup$1[base64.charCodeAt(i+2)];encoded4=lookup$1[base64.charCodeAt(i+3)];bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63;}
return arraybuffer;};var withNativeArrayBuffer$1=typeof ArrayBuffer==="function";var decodePacket=function decodePacket(encodedPacket,binaryType){if(typeof encodedPacket!=="string"){return{type:"message",data:mapBinary(encodedPacket,binaryType)};}
var type=encodedPacket.charAt(0);if(type==="b"){return{type:"message",data:decodeBase64Packet(encodedPacket.substring(1),binaryType)};}
var packetType=PACKET_TYPES_REVERSE[type];if(!packetType){return ERROR_PACKET;}
return encodedPacket.length>1?{type:PACKET_TYPES_REVERSE[type],data:encodedPacket.substring(1)}:{type:PACKET_TYPES_REVERSE[type]};};var decodeBase64Packet=function decodeBase64Packet(data,binaryType){if(withNativeArrayBuffer$1){var decoded=decode$1(data);return mapBinary(decoded,binaryType);}else{return{base64:true,data:data};}};var mapBinary=function mapBinary(data,binaryType){switch(binaryType){case"blob":return data instanceof ArrayBuffer?new Blob([data]):data;case"arraybuffer":default:return data;}};var SEPARATOR=String.fromCharCode(30);var encodePayload=function encodePayload(packets,callback){var length=packets.length;var encodedPackets=new Array(length);var count=0;packets.forEach(function(packet,i){encodePacket(packet,false,function(encodedPacket){encodedPackets[i]=encodedPacket;if(++count===length){callback(encodedPackets.join(SEPARATOR));}});});};var decodePayload=function decodePayload(encodedPayload,binaryType){var encodedPackets=encodedPayload.split(SEPARATOR);var packets=[];for(var i=0;i<encodedPackets.length;i++){var decodedPacket=decodePacket(encodedPackets[i],binaryType);packets.push(decodedPacket);if(decodedPacket.type==="error"){break;}}
return packets;};var protocol$1=4;var Transport=function(_Emitter){_inherits(Transport,_Emitter);var _super=_createSuper(Transport);function Transport(opts){var _this;_classCallCheck(this,Transport);_this=_super.call(this);_this.writable=false;installTimerFunctions(_assertThisInitialized(_this),opts);_this.opts=opts;_this.query=opts.query;_this.readyState="";_this.socket=opts.socket;return _this;}
_createClass(Transport,[{key:"onError",value:function onError(msg,desc){var err=new Error(msg);err.type="TransportError";err.description=desc;_get(_getPrototypeOf(Transport.prototype),"emit",this).call(this,"error",err);return this;}
},{key:"open",value:function open(){if("closed"===this.readyState||""===this.readyState){this.readyState="opening";this.doOpen();}
return this;}
},{key:"close",value:function close(){if("opening"===this.readyState||"open"===this.readyState){this.doClose();this.onClose();}
return this;}
},{key:"send",value:function send(packets){if("open"===this.readyState){this.write(packets);}}
},{key:"onOpen",value:function onOpen(){this.readyState="open";this.writable=true;_get(_getPrototypeOf(Transport.prototype),"emit",this).call(this,"open");}
},{key:"onData",value:function onData(data){var packet=decodePacket(data,this.socket.binaryType);this.onPacket(packet);}
},{key:"onPacket",value:function onPacket(packet){_get(_getPrototypeOf(Transport.prototype),"emit",this).call(this,"packet",packet);}
},{key:"onClose",value:function onClose(){this.readyState="closed";_get(_getPrototypeOf(Transport.prototype),"emit",this).call(this,"close");}}]);return Transport;}(Emitter_1);var alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),length=64,map={},seed=0,i=0,prev;function encode(num){var encoded='';do{encoded=alphabet[num%length]+encoded;num=Math.floor(num/length);}while(num>0);return encoded;}
function decode(str){var decoded=0;for(i=0;i<str.length;i++){decoded=decoded*length+map[str.charAt(i)];}
return decoded;}
function yeast(){var now=encode(+new Date());if(now!==prev)return seed=0,prev=now;return now+'.'+encode(seed++);}
for(;i<length;i++){map[alphabet[i]]=i;}
yeast.encode=encode;yeast.decode=decode;var yeast_1=yeast;var parseqs={};parseqs.encode=function(obj){var str='';for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+='&';str+=encodeURIComponent(i)+'='+encodeURIComponent(obj[i]);}}
return str;};parseqs.decode=function(qs){var qry={};var pairs=qs.split('&');for(var i=0,l=pairs.length;i<l;i++){var pair=pairs[i].split('=');qry[decodeURIComponent(pair[0])]=decodeURIComponent(pair[1]);}
return qry;};var Polling=function(_Transport){_inherits(Polling,_Transport);var _super=_createSuper(Polling);function Polling(){var _this;_classCallCheck(this,Polling);_this=_super.apply(this,arguments);_this.polling=false;return _this;}
_createClass(Polling,[{key:"name",get:function get(){return"polling";}
},{key:"doOpen",value:function doOpen(){this.poll();}
},{key:"pause",value:function pause(onPause){var _this2=this;this.readyState="pausing";var pause=function pause(){_this2.readyState="paused";onPause();};if(this.polling||!this.writable){var total=0;if(this.polling){total++;this.once("pollComplete",function(){--total||pause();});}
if(!this.writable){total++;this.once("drain",function(){--total||pause();});}}else{pause();}}
},{key:"poll",value:function poll(){this.polling=true;this.doPoll();this.emit("poll");}
},{key:"onData",value:function onData(data){var _this3=this;var callback=function callback(packet){if("opening"===_this3.readyState&&packet.type==="open"){_this3.onOpen();}
if("close"===packet.type){_this3.onClose();return false;}
_this3.onPacket(packet);};decodePayload(data,this.socket.binaryType).forEach(callback);if("closed"!==this.readyState){this.polling=false;this.emit("pollComplete");if("open"===this.readyState){this.poll();}}}
},{key:"doClose",value:function doClose(){var _this4=this;var close=function close(){_this4.write([{type:"close"}]);};if("open"===this.readyState){close();}else{this.once("open",close);}}
},{key:"write",value:function write(packets){var _this5=this;this.writable=false;encodePayload(packets,function(data){_this5.doWrite(data,function(){_this5.writable=true;_this5.emit("drain");});});}
},{key:"uri",value:function uri(){var query=this.query||{};var schema=this.opts.secure?"https":"http";var port="";if(false!==this.opts.timestampRequests){query[this.opts.timestampParam]=yeast_1();}
if(!this.supportsBinary&&!query.sid){query.b64=1;}
if(this.opts.port&&("https"===schema&&Number(this.opts.port)!==443||"http"===schema&&Number(this.opts.port)!==80)){port=":"+this.opts.port;}
var encodedQuery=parseqs.encode(query);var ipv6=this.opts.hostname.indexOf(":")!==-1;return schema+"://"+(ipv6?"["+this.opts.hostname+"]":this.opts.hostname)+port+this.opts.path+(encodedQuery.length?"?"+encodedQuery:"");}}]);return Polling;}(Transport);function empty(){}
var hasXHR2=function(){var xhr=new XMLHttpRequest$1({xdomain:false});return null!=xhr.responseType;}();var XHR=function(_Polling){_inherits(XHR,_Polling);var _super=_createSuper(XHR);function XHR(opts){var _this;_classCallCheck(this,XHR);_this=_super.call(this,opts);if(typeof location!=="undefined"){var isSSL="https:"===location.protocol;var port=location.port;if(!port){port=isSSL?"443":"80";}
_this.xd=typeof location!=="undefined"&&opts.hostname!==location.hostname||port!==opts.port;_this.xs=opts.secure!==isSSL;}
var forceBase64=opts&&opts.forceBase64;_this.supportsBinary=hasXHR2&&!forceBase64;return _this;}
_createClass(XHR,[{key:"request",value:function request(){var opts=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_extends(opts,{xd:this.xd,xs:this.xs},this.opts);return new Request(this.uri(),opts);}
},{key:"doWrite",value:function doWrite(data,fn){var _this2=this;var req=this.request({method:"POST",data:data});req.on("success",fn);req.on("error",function(err){_this2.onError("xhr post error",err);});}
},{key:"doPoll",value:function doPoll(){var _this3=this;var req=this.request();req.on("data",this.onData.bind(this));req.on("error",function(err){_this3.onError("xhr poll error",err);});this.pollXhr=req;}}]);return XHR;}(Polling);var Request=function(_Emitter){_inherits(Request,_Emitter);var _super2=_createSuper(Request);function Request(uri,opts){var _this4;_classCallCheck(this,Request);_this4=_super2.call(this);installTimerFunctions(_assertThisInitialized(_this4),opts);_this4.opts=opts;_this4.method=opts.method||"GET";_this4.uri=uri;_this4.async=false!==opts.async;_this4.data=undefined!==opts.data?opts.data:null;_this4.create();return _this4;}
_createClass(Request,[{key:"create",value:function create(){var _this5=this;var opts=pick(this.opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");opts.xdomain=!!this.opts.xd;opts.xscheme=!!this.opts.xs;var xhr=this.xhr=new XMLHttpRequest$1(opts);try{xhr.open(this.method,this.uri,this.async);try{if(this.opts.extraHeaders){xhr.setDisableHeaderCheck&&xhr.setDisableHeaderCheck(true);for(var i in this.opts.extraHeaders){if(this.opts.extraHeaders.hasOwnProperty(i)){xhr.setRequestHeader(i,this.opts.extraHeaders[i]);}}}}catch(e){}
if("POST"===this.method){try{xhr.setRequestHeader("Content-type","text/plain;charset=UTF-8");}catch(e){}}
try{xhr.setRequestHeader("Accept","*/*");}catch(e){}
if("withCredentials"in xhr){xhr.withCredentials=this.opts.withCredentials;}
if(this.opts.requestTimeout){xhr.timeout=this.opts.requestTimeout;}
xhr.onreadystatechange=function(){if(4!==xhr.readyState)return;if(200===xhr.status||1223===xhr.status){_this5.onLoad();}else{_this5.setTimeoutFn(function(){_this5.onError(typeof xhr.status==="number"?xhr.status:0);},0);}};xhr.send(this.data);}catch(e){this.setTimeoutFn(function(){_this5.onError(e);},0);return;}
if(typeof document!=="undefined"){this.index=Request.requestsCount++;Request.requests[this.index]=this;}}
},{key:"onSuccess",value:function onSuccess(){this.emit("success");this.cleanup();}
},{key:"onData",value:function onData(data){this.emit("data",data);this.onSuccess();}
},{key:"onError",value:function onError(err){this.emit("error",err);this.cleanup(true);}
},{key:"cleanup",value:function cleanup(fromError){if("undefined"===typeof this.xhr||null===this.xhr){return;}
this.xhr.onreadystatechange=empty;if(fromError){try{this.xhr.abort();}catch(e){}}
if(typeof document!=="undefined"){delete Request.requests[this.index];}
this.xhr=null;}
},{key:"onLoad",value:function onLoad(){var data=this.xhr.responseText;if(data!==null){this.onData(data);}}
},{key:"abort",value:function abort(){this.cleanup();}}]);return Request;}(Emitter_1);Request.requestsCount=0;Request.requests={};if(typeof document!=="undefined"){if(typeof attachEvent==="function"){attachEvent("onunload",unloadHandler);}else if(typeof addEventListener==="function"){var terminationEvent="onpagehide"in globalThis?"pagehide":"unload";addEventListener(terminationEvent,unloadHandler,false);}}
function unloadHandler(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort();}}}
var nextTick=function(){var isPromiseAvailable=typeof Promise==="function"&&typeof Promise.resolve==="function";if(isPromiseAvailable){return function(cb){return Promise.resolve().then(cb);};}else{return function(cb,setTimeoutFn){return setTimeoutFn(cb,0);};}}();var WebSocket=globalThis.WebSocket||globalThis.MozWebSocket;var usingBrowserWebSocket=true;var defaultBinaryType="arraybuffer";var isReactNative=typeof navigator!=="undefined"&&typeof navigator.product==="string"&&navigator.product.toLowerCase()==="reactnative";var WS=function(_Transport){_inherits(WS,_Transport);var _super=_createSuper(WS);function WS(opts){var _this;_classCallCheck(this,WS);_this=_super.call(this,opts);_this.supportsBinary=!opts.forceBase64;return _this;}
_createClass(WS,[{key:"name",get:function get(){return"websocket";}
},{key:"doOpen",value:function doOpen(){if(!this.check()){return;}
var uri=this.uri();var protocols=this.opts.protocols;var opts=isReactNative?{}:pick(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");if(this.opts.extraHeaders){opts.headers=this.opts.extraHeaders;}
try{this.ws=usingBrowserWebSocket&&!isReactNative?protocols?new WebSocket(uri,protocols):new WebSocket(uri):new WebSocket(uri,protocols,opts);}catch(err){return this.emit("error",err);}
this.ws.binaryType=this.socket.binaryType||defaultBinaryType;this.addEventListeners();}
},{key:"addEventListeners",value:function addEventListeners(){var _this2=this;this.ws.onopen=function(){if(_this2.opts.autoUnref){_this2.ws._socket.unref();}
_this2.onOpen();};this.ws.onclose=this.onClose.bind(this);this.ws.onmessage=function(ev){return _this2.onData(ev.data);};this.ws.onerror=function(e){return _this2.onError("websocket error",e);};}
},{key:"write",value:function write(packets){var _this3=this;this.writable=false;var _loop=function _loop(i){var packet=packets[i];var lastPacket=i===packets.length-1;encodePacket(packet,_this3.supportsBinary,function(data){var opts={};try{if(usingBrowserWebSocket){_this3.ws.send(data);}}catch(e){}
if(lastPacket){nextTick(function(){_this3.writable=true;_this3.emit("drain");},_this3.setTimeoutFn);}});};for(var i=0;i<packets.length;i++){_loop(i);}}
},{key:"doClose",value:function doClose(){if(typeof this.ws!=="undefined"){this.ws.close();this.ws=null;}}
},{key:"uri",value:function uri(){var query=this.query||{};var schema=this.opts.secure?"wss":"ws";var port="";if(this.opts.port&&("wss"===schema&&Number(this.opts.port)!==443||"ws"===schema&&Number(this.opts.port)!==80)){port=":"+this.opts.port;}
if(this.opts.timestampRequests){query[this.opts.timestampParam]=yeast_1();}
if(!this.supportsBinary){query.b64=1;}
var encodedQuery=parseqs.encode(query);var ipv6=this.opts.hostname.indexOf(":")!==-1;return schema+"://"+(ipv6?"["+this.opts.hostname+"]":this.opts.hostname)+port+this.opts.path+(encodedQuery.length?"?"+encodedQuery:"");}
},{key:"check",value:function check(){return!!WebSocket&&!("__initialize"in WebSocket&&this.name===WS.prototype.name);}}]);return WS;}(Transport);var transports={websocket:WS,polling:XHR};var Socket$1=function(_Emitter){_inherits(Socket,_Emitter);var _super=_createSuper(Socket);function Socket(uri){var _this;var opts=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};_classCallCheck(this,Socket);_this=_super.call(this);if(uri&&"object"===_typeof(uri)){opts=uri;uri=null;}
if(uri){uri=parseuri(uri);opts.hostname=uri.host;opts.secure=uri.protocol==="https"||uri.protocol==="wss";opts.port=uri.port;if(uri.query)opts.query=uri.query;}else if(opts.host){opts.hostname=parseuri(opts.host).host;}
installTimerFunctions(_assertThisInitialized(_this),opts);_this.secure=null!=opts.secure?opts.secure:typeof location!=="undefined"&&"https:"===location.protocol;if(opts.hostname&&!opts.port){opts.port=_this.secure?"443":"80";}
_this.hostname=opts.hostname||(typeof location!=="undefined"?location.hostname:"localhost");_this.port=opts.port||(typeof location!=="undefined"&&location.port?location.port:_this.secure?"443":"80");_this.transports=opts.transports||["polling","websocket"];_this.readyState="";_this.writeBuffer=[];_this.prevBufferLen=0;_this.opts=_extends({path:"/engine.io",agent:false,withCredentials:false,upgrade:true,timestampParam:"t",rememberUpgrade:false,rejectUnauthorized:true,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:true},opts);_this.opts.path=_this.opts.path.replace(/\/$/,"")+"/";if(typeof _this.opts.query==="string"){_this.opts.query=parseqs.decode(_this.opts.query);}
_this.id=null;_this.upgrades=null;_this.pingInterval=null;_this.pingTimeout=null;_this.pingTimeoutTimer=null;if(typeof addEventListener==="function"){if(_this.opts.closeOnBeforeunload){addEventListener("beforeunload",function(){if(_this.transport){_this.transport.removeAllListeners();_this.transport.close();}},false);}
if(_this.hostname!=="localhost"){_this.offlineEventListener=function(){_this.onClose("transport close");};addEventListener("offline",_this.offlineEventListener,false);}}
_this.open();return _this;}
_createClass(Socket,[{key:"createTransport",value:function createTransport(name){var query=clone(this.opts.query);query.EIO=protocol$1;query.transport=name;if(this.id)query.sid=this.id;var opts=_extends({},this.opts.transportOptions[name],this.opts,{query:query,socket:this,hostname:this.hostname,secure:this.secure,port:this.port});return new transports[name](opts);}
},{key:"open",value:function open(){var _this2=this;var transport;if(this.opts.rememberUpgrade&&Socket.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1){transport="websocket";}else if(0===this.transports.length){this.setTimeoutFn(function(){_this2.emitReserved("error","No transports available");},0);return;}else{transport=this.transports[0];}
this.readyState="opening";try{transport=this.createTransport(transport);}catch(e){this.transports.shift();this.open();return;}
transport.open();this.setTransport(transport);}
},{key:"setTransport",value:function setTransport(transport){var _this3=this;if(this.transport){this.transport.removeAllListeners();}
this.transport=transport;transport.on("drain",this.onDrain.bind(this)).on("packet",this.onPacket.bind(this)).on("error",this.onError.bind(this)).on("close",function(){_this3.onClose("transport close");});}
},{key:"probe",value:function probe(name){var _this4=this;var transport=this.createTransport(name);var failed=false;Socket.priorWebsocketSuccess=false;var onTransportOpen=function onTransportOpen(){if(failed)return;transport.send([{type:"ping",data:"probe"}]);transport.once("packet",function(msg){if(failed)return;if("pong"===msg.type&&"probe"===msg.data){_this4.upgrading=true;_this4.emitReserved("upgrading",transport);if(!transport)return;Socket.priorWebsocketSuccess="websocket"===transport.name;_this4.transport.pause(function(){if(failed)return;if("closed"===_this4.readyState)return;cleanup();_this4.setTransport(transport);transport.send([{type:"upgrade"}]);_this4.emitReserved("upgrade",transport);transport=null;_this4.upgrading=false;_this4.flush();});}else{var err=new Error("probe error");err.transport=transport.name;_this4.emitReserved("upgradeError",err);}});};function freezeTransport(){if(failed)return;failed=true;cleanup();transport.close();transport=null;}
var onerror=function onerror(err){var error=new Error("probe error: "+err);error.transport=transport.name;freezeTransport();_this4.emitReserved("upgradeError",error);};function onTransportClose(){onerror("transport closed");}
function onclose(){onerror("socket closed");}
function onupgrade(to){if(transport&&to.name!==transport.name){freezeTransport();}}
var cleanup=function cleanup(){transport.removeListener("open",onTransportOpen);transport.removeListener("error",onerror);transport.removeListener("close",onTransportClose);_this4.off("close",onclose);_this4.off("upgrading",onupgrade);};transport.once("open",onTransportOpen);transport.once("error",onerror);transport.once("close",onTransportClose);this.once("close",onclose);this.once("upgrading",onupgrade);transport.open();}
},{key:"onOpen",value:function onOpen(){this.readyState="open";Socket.priorWebsocketSuccess="websocket"===this.transport.name;this.emitReserved("open");this.flush();if("open"===this.readyState&&this.opts.upgrade&&this.transport.pause){var i=0;var l=this.upgrades.length;for(;i<l;i++){this.probe(this.upgrades[i]);}}}
},{key:"onPacket",value:function onPacket(packet){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){this.emitReserved("packet",packet);this.emitReserved("heartbeat");switch(packet.type){case"open":this.onHandshake(JSON.parse(packet.data));break;case"ping":this.resetPingTimeout();this.sendPacket("pong");this.emitReserved("ping");this.emitReserved("pong");break;case"error":var err=new Error("server error");err.code=packet.data;this.onError(err);break;case"message":this.emitReserved("data",packet.data);this.emitReserved("message",packet.data);break;}}}
},{key:"onHandshake",value:function onHandshake(data){this.emitReserved("handshake",data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=this.filterUpgrades(data.upgrades);this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();if("closed"===this.readyState)return;this.resetPingTimeout();}
},{key:"resetPingTimeout",value:function resetPingTimeout(){var _this5=this;this.clearTimeoutFn(this.pingTimeoutTimer);this.pingTimeoutTimer=this.setTimeoutFn(function(){_this5.onClose("ping timeout");},this.pingInterval+this.pingTimeout);if(this.opts.autoUnref){this.pingTimeoutTimer.unref();}}
},{key:"onDrain",value:function onDrain(){this.writeBuffer.splice(0,this.prevBufferLen);this.prevBufferLen=0;if(0===this.writeBuffer.length){this.emitReserved("drain");}else{this.flush();}}
},{key:"flush",value:function flush(){if("closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){this.transport.send(this.writeBuffer);this.prevBufferLen=this.writeBuffer.length;this.emitReserved("flush");}}
},{key:"write",value:function write(msg,options,fn){this.sendPacket("message",msg,options,fn);return this;}},{key:"send",value:function send(msg,options,fn){this.sendPacket("message",msg,options,fn);return this;}
},{key:"sendPacket",value:function sendPacket(type,data,options,fn){if("function"===typeof data){fn=data;data=undefined;}
if("function"===typeof options){fn=options;options=null;}
if("closing"===this.readyState||"closed"===this.readyState){return;}
options=options||{};options.compress=false!==options.compress;var packet={type:type,data:data,options:options};this.emitReserved("packetCreate",packet);this.writeBuffer.push(packet);if(fn)this.once("flush",fn);this.flush();}
},{key:"close",value:function close(){var _this6=this;var close=function close(){_this6.onClose("forced close");_this6.transport.close();};var cleanupAndClose=function cleanupAndClose(){_this6.off("upgrade",cleanupAndClose);_this6.off("upgradeError",cleanupAndClose);close();};var waitForUpgrade=function waitForUpgrade(){_this6.once("upgrade",cleanupAndClose);_this6.once("upgradeError",cleanupAndClose);};if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";if(this.writeBuffer.length){this.once("drain",function(){if(_this6.upgrading){waitForUpgrade();}else{close();}});}else if(this.upgrading){waitForUpgrade();}else{close();}}
return this;}
},{key:"onError",value:function onError(err){Socket.priorWebsocketSuccess=false;this.emitReserved("error",err);this.onClose("transport error",err);}
},{key:"onClose",value:function onClose(reason,desc){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){this.clearTimeoutFn(this.pingTimeoutTimer);this.transport.removeAllListeners("close");this.transport.close();this.transport.removeAllListeners();if(typeof removeEventListener==="function"){removeEventListener("offline",this.offlineEventListener,false);}
this.readyState="closed";this.id=null;this.emitReserved("close",reason,desc);this.writeBuffer=[];this.prevBufferLen=0;}}
},{key:"filterUpgrades",value:function filterUpgrades(upgrades){var filteredUpgrades=[];var i=0;var j=upgrades.length;for(;i<j;i++){if(~this.transports.indexOf(upgrades[i]))filteredUpgrades.push(upgrades[i]);}
return filteredUpgrades;}}]);return Socket;}(Emitter_1);Socket$1.protocol=protocol$1;function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i];}}
return o;}
var withNativeArrayBuffer=typeof ArrayBuffer==="function";var isView=function isView(obj){return typeof ArrayBuffer.isView==="function"?ArrayBuffer.isView(obj):obj.buffer instanceof ArrayBuffer;};var toString=Object.prototype.toString;var withNativeBlob=typeof Blob==="function"||typeof Blob!=="undefined"&&toString.call(Blob)==="[object BlobConstructor]";var withNativeFile=typeof File==="function"||typeof File!=="undefined"&&toString.call(File)==="[object FileConstructor]";function isBinary(obj){return withNativeArrayBuffer&&(obj instanceof ArrayBuffer||isView(obj))||withNativeBlob&&obj instanceof Blob||withNativeFile&&obj instanceof File;}
function hasBinary(obj,toJSON){if(!obj||_typeof(obj)!=="object"){return false;}
if(Array.isArray(obj)){for(var i=0,l=obj.length;i<l;i++){if(hasBinary(obj[i])){return true;}}
return false;}
if(isBinary(obj)){return true;}
if(obj.toJSON&&typeof obj.toJSON==="function"&&arguments.length===1){return hasBinary(obj.toJSON(),true);}
for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)&&hasBinary(obj[key])){return true;}}
return false;}
function deconstructPacket(packet){var buffers=[];var packetData=packet.data;var pack=packet;pack.data=_deconstructPacket(packetData,buffers);pack.attachments=buffers.length;return{packet:pack,buffers:buffers};}
function _deconstructPacket(data,buffers){if(!data)return data;if(isBinary(data)){var placeholder={_placeholder:true,num:buffers.length};buffers.push(data);return placeholder;}else if(Array.isArray(data)){var newData=new Array(data.length);for(var i=0;i<data.length;i++){newData[i]=_deconstructPacket(data[i],buffers);}
return newData;}else if(_typeof(data)==="object"&&!(data instanceof Date)){var _newData={};for(var key in data){if(data.hasOwnProperty(key)){_newData[key]=_deconstructPacket(data[key],buffers);}}
return _newData;}
return data;}
function reconstructPacket(packet,buffers){packet.data=_reconstructPacket(packet.data,buffers);packet.attachments=undefined;return packet;}
function _reconstructPacket(data,buffers){if(!data)return data;if(data&&data._placeholder){return buffers[data.num];}else if(Array.isArray(data)){for(var i=0;i<data.length;i++){data[i]=_reconstructPacket(data[i],buffers);}}else if(_typeof(data)==="object"){for(var key in data){if(data.hasOwnProperty(key)){data[key]=_reconstructPacket(data[key],buffers);}}}
return data;}
var protocol=5;var PacketType;(function(PacketType){PacketType[PacketType["CONNECT"]=0]="CONNECT";PacketType[PacketType["DISCONNECT"]=1]="DISCONNECT";PacketType[PacketType["EVENT"]=2]="EVENT";PacketType[PacketType["ACK"]=3]="ACK";PacketType[PacketType["CONNECT_ERROR"]=4]="CONNECT_ERROR";PacketType[PacketType["BINARY_EVENT"]=5]="BINARY_EVENT";PacketType[PacketType["BINARY_ACK"]=6]="BINARY_ACK";})(PacketType||(PacketType={}));var Encoder=function(){function Encoder(){_classCallCheck(this,Encoder);}
_createClass(Encoder,[{key:"encode",value:function encode(obj){if(obj.type===PacketType.EVENT||obj.type===PacketType.ACK){if(hasBinary(obj)){obj.type=obj.type===PacketType.EVENT?PacketType.BINARY_EVENT:PacketType.BINARY_ACK;return this.encodeAsBinary(obj);}}
return[this.encodeAsString(obj)];}
},{key:"encodeAsString",value:function encodeAsString(obj){var str=""+obj.type;if(obj.type===PacketType.BINARY_EVENT||obj.type===PacketType.BINARY_ACK){str+=obj.attachments+"-";}
if(obj.nsp&&"/"!==obj.nsp){str+=obj.nsp+",";}
if(null!=obj.id){str+=obj.id;}
if(null!=obj.data){str+=JSON.stringify(obj.data);}
return str;}
},{key:"encodeAsBinary",value:function encodeAsBinary(obj){var deconstruction=deconstructPacket(obj);var pack=this.encodeAsString(deconstruction.packet);var buffers=deconstruction.buffers;buffers.unshift(pack);return buffers;}}]);return Encoder;}();var Decoder=function(_Emitter){_inherits(Decoder,_Emitter);var _super=_createSuper(Decoder);function Decoder(){_classCallCheck(this,Decoder);return _super.call(this);}
_createClass(Decoder,[{key:"add",value:function add(obj){var packet;if(typeof obj==="string"){packet=this.decodeString(obj);if(packet.type===PacketType.BINARY_EVENT||packet.type===PacketType.BINARY_ACK){this.reconstructor=new BinaryReconstructor(packet);if(packet.attachments===0){_get(_getPrototypeOf(Decoder.prototype),"emitReserved",this).call(this,"decoded",packet);}}else{_get(_getPrototypeOf(Decoder.prototype),"emitReserved",this).call(this,"decoded",packet);}}else if(isBinary(obj)||obj.base64){if(!this.reconstructor){throw new Error("got binary data when not reconstructing a packet");}else{packet=this.reconstructor.takeBinaryData(obj);if(packet){this.reconstructor=null;_get(_getPrototypeOf(Decoder.prototype),"emitReserved",this).call(this,"decoded",packet);}}}else{throw new Error("Unknown type: "+obj);}}
},{key:"decodeString",value:function decodeString(str){var i=0;var p={type:Number(str.charAt(0))};if(PacketType[p.type]===undefined){throw new Error("unknown packet type "+p.type);}
if(p.type===PacketType.BINARY_EVENT||p.type===PacketType.BINARY_ACK){var start=i+1;while(str.charAt(++i)!=="-"&&i!=str.length){}
var buf=str.substring(start,i);if(buf!=Number(buf)||str.charAt(i)!=="-"){throw new Error("Illegal attachments");}
p.attachments=Number(buf);}
if("/"===str.charAt(i+1)){var _start=i+1;while(++i){var c=str.charAt(i);if(","===c)break;if(i===str.length)break;}
p.nsp=str.substring(_start,i);}else{p.nsp="/";}
var next=str.charAt(i+1);if(""!==next&&Number(next)==next){var _start2=i+1;while(++i){var _c=str.charAt(i);if(null==_c||Number(_c)!=_c){--i;break;}
if(i===str.length)break;}
p.id=Number(str.substring(_start2,i+1));}
if(str.charAt(++i)){var payload=tryParse(str.substr(i));if(Decoder.isPayloadValid(p.type,payload)){p.data=payload;}else{throw new Error("invalid payload");}}
return p;}},{key:"destroy",value:function destroy(){if(this.reconstructor){this.reconstructor.finishedReconstruction();}}}],[{key:"isPayloadValid",value:function isPayloadValid(type,payload){switch(type){case PacketType.CONNECT:return _typeof(payload)==="object";case PacketType.DISCONNECT:return payload===undefined;case PacketType.CONNECT_ERROR:return typeof payload==="string"||_typeof(payload)==="object";case PacketType.EVENT:case PacketType.BINARY_EVENT:return Array.isArray(payload)&&payload.length>0;case PacketType.ACK:case PacketType.BINARY_ACK:return Array.isArray(payload);}}}]);return Decoder;}(Emitter_1);function tryParse(str){try{return JSON.parse(str);}catch(e){return false;}}
var BinaryReconstructor=function(){function BinaryReconstructor(packet){_classCallCheck(this,BinaryReconstructor);this.packet=packet;this.buffers=[];this.reconPack=packet;}
_createClass(BinaryReconstructor,[{key:"takeBinaryData",value:function takeBinaryData(binData){this.buffers.push(binData);if(this.buffers.length===this.reconPack.attachments){var packet=reconstructPacket(this.reconPack,this.buffers);this.finishedReconstruction();return packet;}
return null;}
},{key:"finishedReconstruction",value:function finishedReconstruction(){this.reconPack=null;this.buffers=[];}}]);return BinaryReconstructor;}();var parser=Object.freeze({__proto__:null,protocol:protocol,get PacketType(){return PacketType;},Encoder:Encoder,Decoder:Decoder});function on(obj,ev,fn){obj.on(ev,fn);return function subDestroy(){obj.off(ev,fn);};}
var RESERVED_EVENTS=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});var Socket=function(_Emitter){_inherits(Socket,_Emitter);var _super=_createSuper(Socket);function Socket(io,nsp,opts){var _this;_classCallCheck(this,Socket);_this=_super.call(this);_this.connected=false;_this.disconnected=true;_this.receiveBuffer=[];_this.sendBuffer=[];_this.ids=0;_this.acks={};_this.flags={};_this.io=io;_this.nsp=nsp;if(opts&&opts.auth){_this.auth=opts.auth;}
if(_this.io._autoConnect)_this.open();return _this;}
_createClass(Socket,[{key:"subEvents",value:function subEvents(){if(this.subs)return;var io=this.io;this.subs=[on(io,"open",this.onopen.bind(this)),on(io,"packet",this.onpacket.bind(this)),on(io,"error",this.onerror.bind(this)),on(io,"close",this.onclose.bind(this))];}
},{key:"active",get:function get(){return!!this.subs;}
},{key:"connect",value:function connect(){if(this.connected)return this;this.subEvents();if(!this.io["_reconnecting"])this.io.open();if("open"===this.io._readyState)this.onopen();return this;}
},{key:"open",value:function open(){return this.connect();}
},{key:"send",value:function send(){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}
args.unshift("message");this.emit.apply(this,args);return this;}
},{key:"emit",value:function emit(ev){if(RESERVED_EVENTS.hasOwnProperty(ev)){throw new Error('"'+ev+'" is a reserved event name');}
for(var _len2=arguments.length,args=new Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){args[_key2-1]=arguments[_key2];}
args.unshift(ev);var packet={type:PacketType.EVENT,data:args};packet.options={};packet.options.compress=this.flags.compress!==false;if("function"===typeof args[args.length-1]){var id=this.ids++;var ack=args.pop();this._registerAckCallback(id,ack);packet.id=id;}
var isTransportWritable=this.io.engine&&this.io.engine.transport&&this.io.engine.transport.writable;var discardPacket=this.flags["volatile"]&&(!isTransportWritable||!this.connected);if(discardPacket);else if(this.connected){this.packet(packet);}else{this.sendBuffer.push(packet);}
this.flags={};return this;}
},{key:"_registerAckCallback",value:function _registerAckCallback(id,ack){var _this2=this;var timeout=this.flags.timeout;if(timeout===undefined){this.acks[id]=ack;return;}
var timer=this.io.setTimeoutFn(function(){delete _this2.acks[id];for(var i=0;i<_this2.sendBuffer.length;i++){if(_this2.sendBuffer[i].id===id){_this2.sendBuffer.splice(i,1);}}
ack.call(_this2,new Error("operation has timed out"));},timeout);this.acks[id]=function(){_this2.io.clearTimeoutFn(timer);for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}
ack.apply(_this2,[null].concat(args));};}
},{key:"packet",value:function packet(_packet){_packet.nsp=this.nsp;this.io._packet(_packet);}
},{key:"onopen",value:function onopen(){var _this3=this;if(typeof this.auth=="function"){this.auth(function(data){_this3.packet({type:PacketType.CONNECT,data:data});});}else{this.packet({type:PacketType.CONNECT,data:this.auth});}}
},{key:"onerror",value:function onerror(err){if(!this.connected){this.emitReserved("connect_error",err);}}
},{key:"onclose",value:function onclose(reason){this.connected=false;this.disconnected=true;delete this.id;this.emitReserved("disconnect",reason);}
},{key:"onpacket",value:function onpacket(packet){var sameNamespace=packet.nsp===this.nsp;if(!sameNamespace)return;switch(packet.type){case PacketType.CONNECT:if(packet.data&&packet.data.sid){var id=packet.data.sid;this.onconnect(id);}else{this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));}
break;case PacketType.EVENT:this.onevent(packet);break;case PacketType.BINARY_EVENT:this.onevent(packet);break;case PacketType.ACK:this.onack(packet);break;case PacketType.BINARY_ACK:this.onack(packet);break;case PacketType.DISCONNECT:this.ondisconnect();break;case PacketType.CONNECT_ERROR:this.destroy();var err=new Error(packet.data.message);err.data=packet.data.data;this.emitReserved("connect_error",err);break;}}
},{key:"onevent",value:function onevent(packet){var args=packet.data||[];if(null!=packet.id){args.push(this.ack(packet.id));}
if(this.connected){this.emitEvent(args);}else{this.receiveBuffer.push(Object.freeze(args));}}},{key:"emitEvent",value:function emitEvent(args){if(this._anyListeners&&this._anyListeners.length){var listeners=this._anyListeners.slice();var _iterator=_createForOfIteratorHelper(listeners),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var listener=_step.value;listener.apply(this,args);}}catch(err){_iterator.e(err);}finally{_iterator.f();}}
_get(_getPrototypeOf(Socket.prototype),"emit",this).apply(this,args);}
},{key:"ack",value:function ack(id){var self=this;var sent=false;return function(){if(sent)return;sent=true;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}
self.packet({type:PacketType.ACK,id:id,data:args});};}
},{key:"onack",value:function onack(packet){var ack=this.acks[packet.id];if("function"===typeof ack){ack.apply(this,packet.data);delete this.acks[packet.id];}}
},{key:"onconnect",value:function onconnect(id){this.id=id;this.connected=true;this.disconnected=false;this.emitBuffered();this.emitReserved("connect");}
},{key:"emitBuffered",value:function emitBuffered(){var _this4=this;this.receiveBuffer.forEach(function(args){return _this4.emitEvent(args);});this.receiveBuffer=[];this.sendBuffer.forEach(function(packet){return _this4.packet(packet);});this.sendBuffer=[];}
},{key:"ondisconnect",value:function ondisconnect(){this.destroy();this.onclose("io server disconnect");}
},{key:"destroy",value:function destroy(){if(this.subs){this.subs.forEach(function(subDestroy){return subDestroy();});this.subs=undefined;}
this.io["_destroy"](this);}
},{key:"disconnect",value:function disconnect(){if(this.connected){this.packet({type:PacketType.DISCONNECT});}
this.destroy();if(this.connected){this.onclose("io client disconnect");}
return this;}
},{key:"close",value:function close(){return this.disconnect();}
},{key:"compress",value:function compress(_compress){this.flags.compress=_compress;return this;}
},{key:"volatile",get:function get(){this.flags["volatile"]=true;return this;}
},{key:"timeout",value:function timeout(_timeout){this.flags.timeout=_timeout;return this;}
},{key:"onAny",value:function onAny(listener){this._anyListeners=this._anyListeners||[];this._anyListeners.push(listener);return this;}
},{key:"prependAny",value:function prependAny(listener){this._anyListeners=this._anyListeners||[];this._anyListeners.unshift(listener);return this;}
},{key:"offAny",value:function offAny(listener){if(!this._anyListeners){return this;}
if(listener){var listeners=this._anyListeners;for(var i=0;i<listeners.length;i++){if(listener===listeners[i]){listeners.splice(i,1);return this;}}}else{this._anyListeners=[];}
return this;}
},{key:"listenersAny",value:function listenersAny(){return this._anyListeners||[];}}]);return Socket;}(Emitter_1);var backo2=Backoff;function Backoff(opts){opts=opts||{};this.ms=opts.min||100;this.max=opts.max||10000;this.factor=opts.factor||2;this.jitter=opts.jitter>0&&opts.jitter<=1?opts.jitter:0;this.attempts=0;}
Backoff.prototype.duration=function(){var ms=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var rand=Math.random();var deviation=Math.floor(rand*this.jitter*ms);ms=(Math.floor(rand*10)&1)==0?ms-deviation:ms+deviation;}
return Math.min(ms,this.max)|0;};Backoff.prototype.reset=function(){this.attempts=0;};Backoff.prototype.setMin=function(min){this.ms=min;};Backoff.prototype.setMax=function(max){this.max=max;};Backoff.prototype.setJitter=function(jitter){this.jitter=jitter;};var Manager=function(_Emitter){_inherits(Manager,_Emitter);var _super=_createSuper(Manager);function Manager(uri,opts){var _this;_classCallCheck(this,Manager);var _a;_this=_super.call(this);_this.nsps={};_this.subs=[];if(uri&&"object"===_typeof(uri)){opts=uri;uri=undefined;}
opts=opts||{};opts.path=opts.path||"/socket.io";_this.opts=opts;installTimerFunctions(_assertThisInitialized(_this),opts);_this.reconnection(opts.reconnection!==false);_this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);_this.reconnectionDelay(opts.reconnectionDelay||1000);_this.reconnectionDelayMax(opts.reconnectionDelayMax||5000);_this.randomizationFactor((_a=opts.randomizationFactor)!==null&&_a!==void 0?_a:0.5);_this.backoff=new backo2({min:_this.reconnectionDelay(),max:_this.reconnectionDelayMax(),jitter:_this.randomizationFactor()});_this.timeout(null==opts.timeout?20000:opts.timeout);_this._readyState="closed";_this.uri=uri;var _parser=opts.parser||parser;_this.encoder=new _parser.Encoder();_this.decoder=new _parser.Decoder();_this._autoConnect=opts.autoConnect!==false;if(_this._autoConnect)_this.open();return _this;}
_createClass(Manager,[{key:"reconnection",value:function reconnection(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this;}},{key:"reconnectionAttempts",value:function reconnectionAttempts(v){if(v===undefined)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this;}},{key:"reconnectionDelay",value:function reconnectionDelay(v){var _a;if(v===undefined)return this._reconnectionDelay;this._reconnectionDelay=v;(_a=this.backoff)===null||_a===void 0?void 0:_a.setMin(v);return this;}},{key:"randomizationFactor",value:function randomizationFactor(v){var _a;if(v===undefined)return this._randomizationFactor;this._randomizationFactor=v;(_a=this.backoff)===null||_a===void 0?void 0:_a.setJitter(v);return this;}},{key:"reconnectionDelayMax",value:function reconnectionDelayMax(v){var _a;if(v===undefined)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;(_a=this.backoff)===null||_a===void 0?void 0:_a.setMax(v);return this;}},{key:"timeout",value:function timeout(v){if(!arguments.length)return this._timeout;this._timeout=v;return this;}
},{key:"maybeReconnectOnOpen",value:function maybeReconnectOnOpen(){if(!this._reconnecting&&this._reconnection&&this.backoff.attempts===0){this.reconnect();}}
},{key:"open",value:function open(fn){var _this2=this;if(~this._readyState.indexOf("open"))return this;this.engine=new Socket$1(this.uri,this.opts);var socket=this.engine;var self=this;this._readyState="opening";this.skipReconnect=false;var openSubDestroy=on(socket,"open",function(){self.onopen();fn&&fn();});var errorSub=on(socket,"error",function(err){self.cleanup();self._readyState="closed";_this2.emitReserved("error",err);if(fn){fn(err);}else{self.maybeReconnectOnOpen();}});if(false!==this._timeout){var timeout=this._timeout;if(timeout===0){openSubDestroy();}
var timer=this.setTimeoutFn(function(){openSubDestroy();socket.close();socket.emit("error",new Error("timeout"));},timeout);if(this.opts.autoUnref){timer.unref();}
this.subs.push(function subDestroy(){clearTimeout(timer);});}
this.subs.push(openSubDestroy);this.subs.push(errorSub);return this;}
},{key:"connect",value:function connect(fn){return this.open(fn);}
},{key:"onopen",value:function onopen(){this.cleanup();this._readyState="open";this.emitReserved("open");var socket=this.engine;this.subs.push(on(socket,"ping",this.onping.bind(this)),on(socket,"data",this.ondata.bind(this)),on(socket,"error",this.onerror.bind(this)),on(socket,"close",this.onclose.bind(this)),on(this.decoder,"decoded",this.ondecoded.bind(this)));}
},{key:"onping",value:function onping(){this.emitReserved("ping");}
},{key:"ondata",value:function ondata(data){this.decoder.add(data);}
},{key:"ondecoded",value:function ondecoded(packet){this.emitReserved("packet",packet);}
},{key:"onerror",value:function onerror(err){this.emitReserved("error",err);}
},{key:"socket",value:function socket(nsp,opts){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp,opts);this.nsps[nsp]=socket;}
return socket;}
},{key:"_destroy",value:function _destroy(socket){var nsps=Object.keys(this.nsps);for(var _i=0,_nsps=nsps;_i<_nsps.length;_i++){var nsp=_nsps[_i];var _socket=this.nsps[nsp];if(_socket.active){return;}}
this._close();}
},{key:"_packet",value:function _packet(packet){var encodedPackets=this.encoder.encode(packet);for(var i=0;i<encodedPackets.length;i++){this.engine.write(encodedPackets[i],packet.options);}}
},{key:"cleanup",value:function cleanup(){this.subs.forEach(function(subDestroy){return subDestroy();});this.subs.length=0;this.decoder.destroy();}
},{key:"_close",value:function _close(){this.skipReconnect=true;this._reconnecting=false;this.onclose("forced close");if(this.engine)this.engine.close();}
},{key:"disconnect",value:function disconnect(){return this._close();}
},{key:"onclose",value:function onclose(reason){this.cleanup();this.backoff.reset();this._readyState="closed";this.emitReserved("close",reason);if(this._reconnection&&!this.skipReconnect){this.reconnect();}}
},{key:"reconnect",value:function reconnect(){var _this3=this;if(this._reconnecting||this.skipReconnect)return this;var self=this;if(this.backoff.attempts>=this._reconnectionAttempts){this.backoff.reset();this.emitReserved("reconnect_failed");this._reconnecting=false;}else{var delay=this.backoff.duration();this._reconnecting=true;var timer=this.setTimeoutFn(function(){if(self.skipReconnect)return;_this3.emitReserved("reconnect_attempt",self.backoff.attempts);if(self.skipReconnect)return;self.open(function(err){if(err){self._reconnecting=false;self.reconnect();_this3.emitReserved("reconnect_error",err);}else{self.onreconnect();}});},delay);if(this.opts.autoUnref){timer.unref();}
this.subs.push(function subDestroy(){clearTimeout(timer);});}}
},{key:"onreconnect",value:function onreconnect(){var attempt=this.backoff.attempts;this._reconnecting=false;this.backoff.reset();this.emitReserved("reconnect",attempt);}}]);return Manager;}(Emitter_1);var cache={};function lookup(uri,opts){if(_typeof(uri)==="object"){opts=uri;uri=undefined;}
opts=opts||{};var parsed=url(uri,opts.path||"/socket.io");var source=parsed.source;var id=parsed.id;var path=parsed.path;var sameNamespace=cache[id]&&path in cache[id]["nsps"];var newConnection=opts.forceNew||opts["force new connection"]||false===opts.multiplex||sameNamespace;var io;if(newConnection){io=new Manager(source,opts);}else{if(!cache[id]){cache[id]=new Manager(source,opts);}
io=cache[id];}
if(parsed.query&&!opts.query){opts.query=parsed.queryKey;}
return io.socket(parsed.path,opts);}
_extends(lookup,{Manager:Manager,Socket:Socket,io:lookup,connect:lookup});return lookup;}));(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global=global||self,global.Mustache=factory());}(this,(function(){'use strict';/*!
   * mustache.js - Logic-less {{mustache}} templates with JavaScript
   * http://github.com/janl/mustache.js
   */
var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==='[object Array]';};function isFunction(object){return typeof object==='function';}
function typeStr(obj){return isArray(obj)?'array':typeof obj;}
function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&');}
function hasProperty(obj,propName){return obj!=null&&typeof obj==='object'&&(propName in obj);}
function primitiveHasOwnProperty(primitive,propName){return(primitive!=null&&typeof primitive!=='object'&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName));}
var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string);}
var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string);}
var entityMap={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s];});}
var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)
return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation='';var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)
delete tokens[spaces.pop()];}else{spaces=[];}
hasTag=false;nonSpace=false;}
var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==='string')
tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)
throw new Error('Invalid tags: '+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+'\\s*');closingTagRe=new RegExp('\\s*'+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp('\\s*'+escapeRegExp('}'+tagsToCompile[1]));}
compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr;}else{nonSpace=true;lineHasNonSpace=true;indentation+=' ';}
tokens.push(['text',chr,start,start+1]);start+=1;if(chr==='\n'){stripSpace();indentation='';tagIndex=0;lineHasNonSpace=false;}}}
if(!scanner.scan(openingTagRe))
break;hasTag=true;type=scanner.scan(tagRe)||'name';scanner.scan(whiteRe);if(type==='='){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe);}else if(type==='{'){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type='&';}else{value=scanner.scanUntil(closingTagRe);}
if(!scanner.scan(closingTagRe))
throw new Error('Unclosed tag at '+scanner.pos);if(type=='>'){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace];}else{token=[type,value,start,scanner.pos];}
tagIndex++;tokens.push(token);if(type==='#'||type==='^'){sections.push(token);}else if(type==='/'){openSection=sections.pop();if(!openSection)
throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)
throw new Error('Unclosed section "'+openSection[1]+'" at '+start);}else if(type==='name'||type==='{'||type==='&'){nonSpace=true;}else if(type==='='){compileTags(value);}}
stripSpace();openSection=sections.pop();if(openSection)
throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens));}
function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==='text'&&lastToken&&lastToken[0]==='text'){lastToken[1]+=token[1];lastToken[3]=token[3];}else{squashedTokens.push(token);lastToken=token;}}}
return squashedTokens;}
function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case'#':case'^':collector.push(token);sections.push(token);collector=token[4]=[];break;case'/':section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token);}}
return nestedTokens;}
function Scanner(string){this.string=string;this.tail=string;this.pos=0;}
Scanner.prototype.eos=function eos(){return this.tail==='';};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)
return'';var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string;};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail='';break;case 0:match='';break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index);}
this.pos+=match.length;return match;};function Context(view,parentContext){this.view=view;this.cache={'.':this.view};this.parent=parentContext;}
Context.prototype.push=function push(view){return new Context(view,this);};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name];}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf('.')>0){intermediateValue=context.view;names=name.split('.');index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)
lookupHit=(hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]));intermediateValue=intermediateValue[names[index++]];}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name);}
if(lookupHit){value=intermediateValue;break;}
context=context.parent;}
cache[name]=value;}
if(isFunction(value))
value=value.call(this.view);return value;};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value;},get:function get(key){return this._cache[key];},clear:function clear(){this._cache={};}};}
Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=='undefined'){this.templateCache.clear();}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+':'+(tags||mustache.tags).join(':');var isCacheEnabled=typeof cache!=='undefined';var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens);}
return tokens;};Writer.prototype.render=function render(template,view,partials,config){var tags=this.getConfigTags(config);var tokens=this.parse(template,tags);var context=(view instanceof Context)?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,config);};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,config){var buffer='';var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==='#')value=this.renderSection(token,context,partials,originalTemplate,config);else if(symbol==='^')value=this.renderInverted(token,context,partials,originalTemplate,config);else if(symbol==='>')value=this.renderPartial(token,context,partials,config);else if(symbol==='&')value=this.unescapedValue(token,context);else if(symbol==='name')value=this.escapedValue(token,context,config);else if(symbol==='text')value=this.rawValue(token);if(value!==undefined)
buffer+=value;}
return buffer;};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate,config){var self=this;var buffer='';var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials,config);}
if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate,config);}}else if(typeof value==='object'||typeof value==='string'||typeof value==='number'){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate,config);}else if(isFunction(value)){if(typeof originalTemplate!=='string')
throw new Error('Cannot use higher-order sections without the original template');value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)
buffer+=value;}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate,config);}
return buffer;};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate,config){var value=context.lookup(token[1]);if(!value||(isArray(value)&&value.length===0))
return this.renderTokens(token[4],context,partials,originalTemplate,config);};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,'');var partialByNl=partial.split('\n');for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i];}}
return partialByNl.join('\n');};Writer.prototype.renderPartial=function renderPartial(token,context,partials,config){if(!partials)return;var tags=this.getConfigTags(config);var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace);}
var tokens=this.parse(indentedValue,tags);return this.renderTokens(tokens,context,partials,indentedValue,config);}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)
return value;};Writer.prototype.escapedValue=function escapedValue(token,context,config){var escape=this.getConfigEscape(config)||mustache.escape;var value=context.lookup(token[1]);if(value!=null)
return(typeof value==='number'&&escape===mustache.escape)?String(value):escape(value);};Writer.prototype.rawValue=function rawValue(token){return token[1];};Writer.prototype.getConfigTags=function getConfigTags(config){if(isArray(config)){return config;}
else if(config&&typeof config==='object'){return config.tags;}
else{return undefined;}};Writer.prototype.getConfigEscape=function getConfigEscape(config){if(config&&typeof config==='object'&&!isArray(config)){return config.escape;}
else{return undefined;}};var mustache={name:'mustache.js',version:'4.2.0',tags:['{{','}}'],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache;},get templateCache(){return defaultWriter.templateCache;}};var defaultWriter=new Writer();mustache.clearCache=function clearCache(){return defaultWriter.clearCache();};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags);};mustache.render=function render(template,view,partials,config){if(typeof template!=='string'){throw new TypeError('Invalid template! Template should be a "string" '+
'but "'+typeStr(template)+'" was given as the first '+
'argument for mustache#render(template, view, partials)');}
return defaultWriter.render(template,view,partials,config);};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache;})));(async()=>{let permission=await Notification.requestPermission();})();var socket=io();function renderTemplate(template_name,data){var template=document.getElementById(template_name).innerHTML;var rendered=Mustache.render(template,data);return rendered;}
function render_settings(settings){const setting_container=document.getElementById("setting_container");setting_container.innerHTML="";for(const[id,setting]of Object.entries(settings)){if(setting.visible==false)continue;setting['id']=id;html=renderTemplate('setting_template',setting);setting_container.innerHTML+=html;}}
socket.on("init",(data,callback)=>{document.getElementById('mode_container').innerHTML='';data['modes'].forEach(mode=>{html=renderTemplate('mode_template',mode);document.getElementById('mode_container').innerHTML+=html;});document.getElementById('sensor_container').innerHTML='';for(const[sensor,sensor_info]of Object.entries(data["sensors"])){sensor_info["id"]=sensor;html=renderTemplate('sensor_template',sensor_info);document.getElementById('sensor_container').innerHTML+=html;};document.getElementById('device_container').innerHTML='';data['devices'].forEach(device=>{html=renderTemplate('device_template',device)
document.getElementById('device_container').innerHTML+=html;});render_settings(data["settings"]);})
socket.on("mode_changed",(data,callback)=>{render_settings(data["settings"]);})
socket.on("state_update",(state,callback)=>{const focused=document.activeElement;var val;for(const[sensor,data]of Object.entries(state["sensor_data"])){const elem=document.getElementById(sensor+'_val');if(!elem){continue;}
if(data['val']==false||data['unit']=='ppm'){val=data['val']}else{val=data['val'].toFixed(2);}
elem.innerHTML=val;}
for(const[machine,status]of Object.entries(state["device_data"])){const elem=document.getElementById(machine);if(!elem){continue;}
elem.checked=status;}
for(const[setting,value]of Object.entries(state["settings"])){const elem=document.getElementById(setting);if(!elem){continue;}
const type=elem.getAttribute('type');if(!elem||elem===focused){continue;}
if(type=="number"){elem.value=value;}
else if(type=="checkbox"){elem.checked=value;}}
document.getElementById("mode_"+state["current_mode"]).checked=true;const devices=document.querySelectorAll(".device input");if(state["current_mode"]!="Manual"){for(var i=0;i<devices.length;i++){devices[i].disabled=true;devices[i].parentElement.classList.add("disabled");}}else{for(var i=0;i<devices.length;i++){devices[i].disabled=false;devices[i].parentElement.classList.remove("disabled");}}})
function mode_change(mode){socket.emit('mode_change',mode,(success)=>{if(success){console.log("Successfully changed mode");}});}
function toggle_device(device){socket.emit('device_toggled',device,(status)=>{document.getElementById(device).checked=status;});}
function on_setting_changed(setting){var value;const elem=document.getElementById(setting);const type=elem.getAttribute('type');if(type=="number"){value=elem.value;}
else if(type=="checkbox"){value=elem.checked;}
data={"setting":setting,"value":value};socket.emit('setting_changed',data);}
const debounceEvent=(callback,time=250,interval)=>(...args)=>clearTimeout(interval,interval=setTimeout(()=>callback(...args),time));function alarm(){alarm_audio.play();}
const alarm_debounced=debounceEvent(alarm,15000);