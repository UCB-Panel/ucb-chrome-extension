// Generated by CoffeeScript 1.6.3
(function(){var e,t,n,r;r=function(){var e,t,n;t=document.getElementById("color");e=t.children[t.selectedIndex].value;localStorage.favorite_color=e;n=document.getElementById("status");n.innerHTML="Options Saved.";return setTimeout(function(){return n.innerHTML=""},750)};n=function(){var e,t,n,r,i;t=localStorage.favorite_color;if(!t)return;r=document.getElementById("color");n=0;i=[];while(n<r.children.length){e=r.children[n];if(e.value===t){e.selected="true";break}i.push(n++)}return i};t=function(){return document.title="UCB-Panel Einstellungen"};e=function(){return document.title="UCB-Panel settings"};document.addEventListener("DOMContentLoaded",n);document.querySelector("#save").addEventListener("click",r);$(document).ready(function(){var n;n=window.navigator.language;switch(n){case"de":return t();case"en":return e();default:return e()}})}).call(this);