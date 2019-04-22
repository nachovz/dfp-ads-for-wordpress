
// Listen for the event.
    document.addEventListener('lazy_ads_loaded', function(){
      _.each(lazy_ads, function(o){
        var lazyElement = document.getElementById(o.unit.j.m || o.unit.l.m);
        if(lazyElement !== null){
          o.scrollY = (o.scrollY === "-1" || parseInt(lazyElement.getBoundingClientRect().bottom, 10));
        }else{
          o.scrollY = 1000000;
        }
      });
    }, false);


// Refresh the bottom slot when it is about to come into view.
var refreshed = false;

// Value of scrollY at which the ad is about to come into view.
var adAlmostVisibleScrollValue = 300;

// Warning: This is a sample implementation. Listening to onscroll without 
// any throttling might not be very efficient.
var listener = function() {
  
  var winner = _.find(lazy_ads, function(o){ return (o.scrollY - 400) <= window.scrollY && !o.refreshed });

  if(winner != undefined && !winner.refreshed){
    googletag.cmd.push(function() {
      console.log("loading: "+winner.unit.J+" at: "+winner.scrollY);
      googletag.pubads().refresh([winner.unit]);
    });
    // Refresh the ad only once.
    winner.refreshed = true;

    // Remove the listener now.
    window.removeEventListener('scroll', listener);
  }
}

window.addEventListener('scroll', _.throttle(listener, 500));