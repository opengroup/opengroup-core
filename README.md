# OpenGroup

P2P web groups with chat functionality and an open architecture so you can add your own plugins.

## A bit more in depth

Maybe you want to play chess, or maybe you want to use an calendar.
OpenGroup will be a webapp in which you can chat with others without having some business selling your data.
The app may be hosted everywhere, after downloading the core it will put itself in offline mode.
After that you can connect to others via a shared url via a process 'websocket signaling'.
You can also connect to others via sending a mail or by scanning a QR code.

## Concepts

### Open Plugin architecture

With OpenGroup it is possible to host your own plugin and hook it in into your group. I want to create an opensource marketplace for plugins which will be a static html site with a search on github for projects prefixed with opengroup-. It would be nice if we had a lot of plugins so we could compete against more closed systems.

### WebRTC

The peer to peer connection is made with WebRTC. With WebRTC to browser tabs anywhere on the world can be connected to each other. Maybe you wonder how this can work, and more specifically how WebRTC knows who to connect to each other. Well, that is the part that WebRTC does not do. We call this process signaling and for this we could use a server or we could use mail or for example QR codes.

### Signaling

If Bob wants to connect to Alice, he starts with doing an stun request. The stun request could be to a stun server he trusts, maybe even his own. The stun server sends back something like his physical address, but more with bits and bytes. This address is packaged in an offer which he sends (signals) to Alice. Alice also does a stun request, may she does this to the public google server or some other server. She gets her 'address' and it gets packaged in an answer along with the original offer and some crypto tricks. This answer needs to be send to Bob, finally if Bob receives it, Bob and Alice will be connected. 

The offer and the answer can be packaged inside a QR code, or in a mail or something else.

### Vuejs

This project uses Vuejs. The 'vue-router' package and the 'vue-form-generator' package are used. Vuejs makes reactivity really easy. I think it also more like a toolset than a complete framework. OpenGroup is already complex enough so that is the reason why I choose Vuejs. 

### ES6, JSPM & gulp

OpenGroup is written in ES6 and uses JSPM for managing packages. Also gulp is used for running tasks.

OpenGroup is a work in progress, if you want to join, please do!

If you want to know a bit more you can check out the slides of a presentation that was made for OpenGroup.
http://opengroup.io/opengroup-presentation

# Getting started

### NodeJS
Make sure you have NodeJS 8 or higher. You can use [Node Version Manager](https://github.com/creationix/nvm) for that.

### Install jspm, gulp and OpenGroup
```
npm install jspm@beta -g
npm install gulp-cli -g

git clone https://github.com/opengroup/opengroup-core.git opengroup-core
cd opengroup-core
npm install

gulp serve
```
Accept the ssl warning because we need https for WebRTC and we use a self signed certificate.
