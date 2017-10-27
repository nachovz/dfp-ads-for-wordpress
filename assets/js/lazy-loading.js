
// Listen for the event.
    document.addEventListener('lazy_ads_loaded', function(){
      _.each(lazy_ads, function(o){
        var lazyElement = document.getElementById(o.unit.j.m) || document.getElementById(o.unit.l.m);//.getBoundingClientRect();
        o.scrollY = (o.scrollY === "-1" || parseInt(lazyElement.getBoundingClientRect().bottom, 10));
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

/* ATF load */
var atf_load = function(){
  var winners = _.filter(lazy_ads, function(o){ return o.scrollY <= 300 && !o.refreshed });

  if(winners != undefined){
    
    _.each(winners, function(winner){
      
      googletag.cmd.push( function() {
        console.log("ATF loading: "+winner.unit.C+" at: "+winner.scrollY);
        googletag.pubads().refresh([winner.unit]);
      });
      
      // Refresh the ad only once.
      winner.refreshed = true;
      
    });
    

    // Remove the listener now.
    //window.removeEventListener('scroll', listener);
  }
}

//window.addEventListener('load', atf_load);

/*if(!singleRefresh){
	setInterval(function(){googletag.pubads().refresh();}, 120000);// 120 Sec 2 min
	singleRefresh = true;
}*/