let version = "2";
let cacheName = "HotelCitymax-v:" + version;
let sharedData = {};
let appShellFiles = [
    "./src/images/bed icon.png",
	"./src/images/call.png",
	"./src/images/close.png",
	"./src/images/coffee.png",
	"./src/images/deluxe 2.png",
	"./src/images/deluxe 3.png",
	"./src/images/deluxe 4.png",
	"./src/images/deluxe lounge.png",
	"./src/images/deluxe.png",
	"./src/images/email.png",
	"./src/images/facebook.png",
	"./src/images/flamingo hall 2.png",
	"./src/images/flamingo hall 3.png",
	"./src/images/flamingo hall.png",
	"./src/images/food.png",
	"./src/images/fridge.png",
	"./src/images/golden hall 2.png",
	"./src/images/golden hall 3.png",
	"./src/images/golden hall.png",
	"./src/images/icon 16x16.png",
	"./src/images/icon 32x32.png",
	"./src/images/icon 48x48.png",
	"./src/images/icon 96x96.png",
	"./src/images/icon 144x144.png",
	"./src/images/icon 192x192.png",
	"./src/images/icon 256x256.png",
	"./src/images/icon 512x512.png",
	"./src/images/icon.ico",
	"./src/images/instagram.png",
	"./src/images/lake nakuru.png",
	"./src/images/logo.png",
	"./src/images/lounge.png",
	"./src/images/menengai crater.png",
	"./src/images/menu.png",
	"./src/images/nakuru city.png",
	"./src/images/repeat add.png",
	"./src/images/restaurant 2.png",
	"./src/images/restaurant 3.png",
	"./src/images/restaurant.png",
	"./src/images/ring logo.png",
	"./src/images/shower.png",
	"./src/images/sleep.png",
	"./src/images/sofa.png",
	"./src/images/standard 2.png",
	"./src/images/standard 3.png",
	"./src/images/standard 4.png",
	"./src/images/standard 5.png",
	"./src/images/standard.png",
	"./src/images/superior 2.png",
	"./src/images/superior 3.png",
	"./src/images/superior 4.png",
	"./src/images/superior.png",
	"./src/images/tripple 2.png",
	"./src/images/tripple 3.png",
	"./src/images/tripple 4.png",
	"./src/images/tripple 5.png",
	"./src/images/tripple.png",
	"./src/images/tv.png",
	"./src/images/twin 2.png",
	"./src/images/twin 3.png",
	"./src/images/twin.png",
	"./src/images/view.png",
	"./src/images/whatsapp.png",
	"./src/images/whole hotel.png",
	"./src/images/wifi.png",
	"./src/images/abadare ranges.png",
	"./accommodation/deluxe/index.css",
	"./accommodation/deluxe/index.html",
	"./accommodation/deluxe/index.js",
	"./accommodation/superior/index.css",
	"./accommodation/superior/index.html",
	"./accommodation/tripple/index.css",
	"./accommodation/tripple/index.html",
	"./accommodation/twin/index.css",
	"./accommodation/twin/index.html",
	"./accommodation/standard/index.css",
	"./accommodation/standard/index.html",
	"./accommodation/index.css",
	"./accommodation/index.html",
	"./accommodation/index.js",
	"./book-now/index.css",
	"./book-now/index.html",
	"./book-now/index.js",
	"./conferencing/index.css",
	"./conferencing/index.html",
	"./conferencing/index.js",
	"./order-now/index.css",
	"./order-now/index.html",
	"./order-now/index.js",
	"./restaurant/index.css",
	"./restaurant/index.html",
	"./restaurant/index.js",
	"./index.css",
	"./index.html",
	"./index.js",
	"./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(appShellFiles);
        })
    )
});

self.addEventListener("fetch", (e) => {
	let url = new URL(e.request.url);
	if(e.request.method == "POST" && url.searchParams.has("share-target")) {
		e.respondWith(Response.redirect('./index.html'));
		e.waitUntil(async function () { 
			try {
				let data = await e.request.formData();
				let link = data.get("link") || "";
				let image = data.get("img") || "";
				sharedData = {image, link};
			} catch (error) {
				sharedData = {error}
			} 
		}());
		return;
		
	} 
    e.respondWith(
        caches.match(e.request, {cacheName, ignoreSearch: true}).then( async (res) => {
			if(res && !/version.js.*$/gi.test(e.request.url)) {
            	return res;
            }
            
            return fetch(e.request).then((res2) => {
            	if(res2.status != 200) {
	            	return res || res2;
            	} 
            	
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request.url.split("?")[0], res2.clone());
                    return res2;
                }).catch((error) => {
					return res2;
				});
            }).catch((error) => {
            	return res || new Response(null, {"status": 200});
            });
		})
    )
});

self.addEventListener("activate", (e) => {
    const keepList = [cacheName];
    
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if(keepList.indexOf(key) === -1) {
                    return caches.delete(key);
                } 
            }))
        })
    )
});

self.addEventListener("message", async (e) => {
	if(e.data && e.data.type == "skip-waiting") {
		self.skipWaiting();
	} 
	else if(e.data && e.data.type == "ready") {
		let clients = await self.clients.matchAll({type: "window"});
		for(let client of clients) {
			if(sharedData.link != undefined && sharedData.image != undefined)
				client.postMessage({type: "shared-data", link: sharedData.link, image: sharedData.image});
			else if(sharedData.error) 
				client.postMessage({type: "shared-data", error: sharedData.error});
		} 
			
	} 
});