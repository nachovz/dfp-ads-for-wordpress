
// Listen for the event. Loading lazy units
    document.addEventListener('lazy_ads_loaded', function(){
        for(let laCounter = 0; laCounter < lazy_ads.length; laCounter++ ){
            var lazyElement = document.getElementById(lazy_ads[laCounter].unit.getSlotElementId());
            if(lazyElement !== null){
                lazy_ads[laCounter].scrollY = (lazy_ads[laCounter].scrollY === "-1" || parseInt(lazyElement.getBoundingClientRect().bottom, 10));
            }else{
                lazy_ads[laCounter].scrollY = 1000000;
            }

        }
    }, false);

//Throttleling the scroll.
var listener = function() {

  let winner = lazy_ads.find( function(o){
    return  (o.scrollY - window.innerHeight) <= window.scrollY
            && (o.scrollY + Math.floor(window.innerHeight/3)) >= window.scrollY
            && !o.refreshed;
    });

    let ready = lazy_ads.find( function(o){
        return Math.floor(o.scrollY - window.innerHeight*1.5) >= (window.scrollY)
        || Math.floor(o.scrollY + window.innerHeight*1) <= (window.scrollY)
        && o.refreshed;
    });

    ready && (ready.refreshed = false);

  if(winner != undefined && !winner.refreshed){
    googletag.cmd.push(function() {
        if(window.dfp_debug) console.log("loading: "+winner.unit.getSlotElementId()+" at: "+winner.scrollY);
      googletag.pubads().refresh([winner.unit]);
    });
    // Refresh the ad
    winner.refreshed = true;
  }
}

function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

window.addEventListener('scroll', throttle(listener, 500));