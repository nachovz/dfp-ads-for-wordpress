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
  //Ad SIZES
  const mappingBox = googletag.sizeMapping().addSize([1000, 768], [300, 600]).addSize([0, 0], [300, 250]).build();

  const mappingBanner = googletag.sizeMapping().addSize([1000, 768], [[970, 90], [728, 90]]).addSize([0, 0], [[320, 100], [320, 50]]).build();

  // Object from Ajax
  var dfp_ad_data = dfp_ad_object[0],
    acct_id = dfp_ad_data.account_id;

    if(dfp_ad_data.dfp_debug){
        window.dfp_debug = dfp_ad_data.dfp_debug;
        console.log(dfp_ad_data);
    }
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
    // Create the event.
    var event = document.createEvent('Event');

    // Define that the event name is 'build'.
    event.initEvent('lazy_ads_loaded', true, true);
    //var event = new Event('lazy_ads_loaded');

    // Dispatch the event.
    document.dispatchEvent(event);
  }

  /**
   * Loads Ad Position
   *
   * @param {Object} position - Array of ad positions
   */
  function define_ad_slot(position) {

    if(get_lazy_loading() === false){

      let slotAd = null; 
      if(position.ad_name.includes("box")) slotAd = googletag.defineSlot(
        acct_id + position.ad_name,
        position.sizes,
        position.position_tag
      ).defineSizeMapping(mappingBox).addService(googletag.pubads());
      if(position.ad_name.includes("banner")) slotAd = googletag.defineSlot(
        acct_id + position.ad_name,
        position.sizes,
        position.position_tag
      ).defineSizeMapping(mappingBanner).addService(googletag.pubads());
      if (!slotAd) slotAd = googletag.defineSlot(
        acct_id + position.ad_name,
        position.sizes,
        position.position_tag
      ).addService(googletag.pubads());

      /*lazy_ads.push({
        "unit"      : slotAd.addService(googletag.pubads()),
        "scrollY"   : position.scrolly, //> -1 ? (document.getElementById(position.position_tag).getBoundingClientRect().bottom || position.scrolly) : position.scrolly,
        "refreshed" : position.scrolly > -1 ? false : true
      });*/

    } else {

      /*if (position.out_of_page === true) {
        googletag.defineOutOfPageSlot(
          acct_id + position.ad_name,
          position.position_tag + '-oop'
        ).addService(googletag.pubads());

      }else{*/
        var theSlot = googletag.defineSlot(
          acct_id + position.ad_name,
          position.sizes,
          position.position_tag
        ).defineSizeMapping(mapping1);
        if( theSlot !== null ){
          theSlot.addService(googletag.pubads());
        }else{
          console.log("Error: Slot not found: "+acct_id+position.ad_name+", "+position.sizes+", "+position.position_tag);
        }
      //}
    }
  }

  /**
   * Sets Page level targeting
   * @param {object} targeting
   */
  function set_targeting(targeting) {
    for (var target in targeting) {
        if(targeting[target]){
            var key = target.toLowerCase();
            googletag.pubads().setTargeting(key, targeting[target]);
        }
    }
  }

  /**
   * Gets lazy loading value
   *
   * return @bool
   */
  function get_lazy_loading() {
    return dfp_ad_data.lazy;
  }

  /**
   * Gets debug flag value
   *
   * return @bool
   */
  function get_debug() {
    return dfp_ad_data.dfp_debug;
  }


  // Generates Ad Slots
  load_ad_positions(dfp_ad_data.positions);
  
  // Targeting
  set_targeting(dfp_ad_data.page_targeting);
  // Asynchronous Loading
  if (dfp_ad_data.asynch === true) {
    //googletag.pubads().enableAsyncRendering();
  }
  //googletag.pubads().enableSingleRequest();
  //Lazy Loading
  if(get_lazy_loading() === false){
    googletag.pubads().enableLazyLoad({
      fetchMarginPercent: 200,  // Fetch slots within 5 viewports.
      renderMarginPercent: 100,  // Render slots within 2 viewports.
      mobileScaling: 2.0  // Double the above values on mobile.
    });
    //googletag.pubads().disableInitialLoad();
  }else{
    // Collapse Empty Divs
    googletag.pubads().collapseEmptyDivs(true);
  }
  // Go

  googletag.enableServices();

});
