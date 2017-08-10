/**
 * Javascript for Google Ads
 *
 **/
 
 /**
  * Global definition
  */
var singleRefresh = false;
var lazy_ads =[];
//TEMP
var dynamic_scroll = 2000;
/**
 * Ad Position Creation
 */
googletag.cmd.push(function () {
  // Object from Ajax
  var dfp_ad_data = dfp_ad_object[0],
    acct_id = dfp_ad_data.account_id;

  /**
   * Loads Ad Position
   *
   * @param {Array} positions - Array of ad positions
   */
  function load_ad_positions(positions) {
    var ad_pos, len;
    // Run through positions
    for (ad_pos = 0, len = positions.length; ad_pos < len; ++ad_pos) {
      define_ad_slot(positions[ad_pos]);
    }
  }

  /**
   * Loads Ad Position
   *
   * @param {Object} position - Array of ad positions
   */
  function define_ad_slot(position) {
    //console.log(position);
		//console.log("Bounding: "+);
    lazy_ads.push({
      "unit"      : googletag.defineSlot(
                      acct_id + position.ad_name,
                      position.sizes,
                      position.position_tag
                    ).addService(googletag.pubads()),
      "scrollY"   : position.scrolly === 0 ? document.getElementById(position.position_tag).getBoundingClientRect().bottom : position.scrolly,
      "refreshed" : false
    });
    
    /*googletag.defineSlot(
      acct_id + position.ad_name,
      position.sizes,
      position.position_tag
    ).addService(googletag.pubads());
    
    if (position.out_of_page === true) {
      googletag.defineOutOfPageSlot(
        acct_id + position.ad_name,
        position.position_tag + '-oop'
      ).addService(googletag.pubads());
    }*/
  }

  /**
   * Sets Page level targeting
   * @param {object} targeting
   */
  function set_targeting(targeting) {
    for (var target in targeting) {
      var key = target.toLowerCase();
      googletag.pubads().setTargeting(key, targeting[target]);
    }
  }

  // Generates Ad Slots
  load_ad_positions(dfp_ad_data.positions);
  // Collapse Empty Divs
  googletag.pubads().collapseEmptyDivs(true);
  // Targeting
  set_targeting(dfp_ad_data.page_targeting);
  // Asynchronous Loading
  if (dfp_ad_data.asynch === true) {
    googletag.pubads().enableAsyncRendering();
  }
  //Lazy Loading
  if(dfp_ad_data.lazy === false){
    googletag.pubads().disableInitialLoad();
  }
  // Go
  googletag.enableServices();
});
