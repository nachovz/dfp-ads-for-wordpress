// Refresh the bottom slot when it is about to come into view.
var refreshed = false;

// Value of scrollY at which the ad is about to come into view.
var adAlmostVisibleScrollValue = 300;

// Warning: This is a sample implementation. Listening to onscroll without 
// any throttling might not be very efficient.
var listener = function() {
  //console.log(window.scrollY);
  var winner = _.find(lazy_ads, function(o){ return (o.scrollY - 300) <= window.scrollY && !o.refreshed });
  
  //if (window.scrollY >= adAlmostVisibleScrollValue && !refreshed) {
  if(winner != undefined && !winner.refreshed){
    googletag.cmd.push(function() {
      //googletag.pubads().refresh([bottomSlot]);
      console.log("loading: "+winner.unit.C+" at: "+winner.scrollY);
      googletag.pubads().refresh([winner.unit]);
    });
    // Refresh the ad only once.
    //refreshed = true;
    winner.refreshed = true;

    // Remove the listener now.
    window.removeEventListener('scroll', listener);
  }
}
window.addEventListener('scroll', _.throttle(listener, 1000));