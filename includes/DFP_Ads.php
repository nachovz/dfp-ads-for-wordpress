<?php
/**
 * Class DFP_Ads
 *
 * @link       http://www.chriwgerber.com/dfp-ads/
 * @since      0.0.1
 *
 * @package    WordPress
 * @subpackage DFP-Ads
 */
namespace DFP_Ads;

Class DFP_Ads {

	/**
	 * Loads Google Ads JS to header
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @var string $google_ad_script_name
	 */
	public $google_ad_script_name = 'google_ad_js';

	/**
	 * Name of the javascript file.
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @var string $script_name
	 */
	public $script_name = 'dfp_ads';

	/**
	 * DFP Account ID. Includes the two slashes
	 *
	 * @since  0.0.1
	 * @access public
	 * @var string $account_id
	 */
	public $account_id;

	/**
	 * Setting for whether to load an ad as asynchronous
	 * or synchronous
	 *
	 * @since  0.3.1
	 * @access public
	 * @var bool $asynch
	 */
	public $asynch;

	/**
	 * Setting for whether to lazy load ad
	 *
	 * @since  0.4.0
	 * @access public
	 * @var bool $lazy
	 */
	public $lazy;

    /**
	 * Setting for enable/disable debug
	 *
	 * @since  1.0.0
	 * @access public
	 * @var bool $dfp_debug
	 */
	public $dfp_debug;

	/**
	 * Stores the URI of the directory
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @var string $dir_uri
	 */
	public $dir_uri;

	/**
	 * Ad Positions - Array
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @var Position DFP_Ads Position
	 */
	public $positions;

	/**
	 * Sets page level targeting
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var array
	 */
	public $page_targeting = array(
		'Page'     => array(),
		'Category' => array(),
		'Tag'      => array(),
		'SecEme'	=> array()
	);

	/**
	 * PHP5 Constructor
	 *
	 * @since  0.0.1
	 * @access public
	 */
	public function __construct() {
		//add_action( 'wp_head', 'insert_gpt_script' );
		/** Creates DFP_Ads Shortcode */
		add_shortcode( 'dfp_ads', array( $this, 'shortcode' ) );
	}

	function insert_gpt_script(){
		?>
			<script async src=""></script>
		<?php
	}

	/**
	 * Set DFP Property Code
	 *
	 * Sets the DFP Property Code. An 8-digit integer
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @param $id int Code ID Number
	 *
	 * @return bool|string
	 */
	public function set_account_id( $id ) {
		$this->account_id = '/' . $id . '/';

		return ( isset( $this->account_id ) ? $this->account_id : false );
	}

	/**
	 * Set Asynchronous Loading
	 *
	 * Sets the flag for how the ads should load. By default, the setting is off,
	 * so it will send 'on' when it's set to load synchronously, rather than
	 * the normal, correct way. This is because asynchronous is default and some
	 * people want to be able to turn it off.
	 *
	 * @since  0.3.1
	 * @access public
	 *
	 * @param string $val
	 *
	 * @return bool
	 */
	public function set_asynchronous_loading( $val ) {
		$this->asynch = ( $val == 'on' ? false : true );

		return ( isset( $this->asynch ) ? $this->asynch : false );
	}

	/**
	 * Set Lazy Loading
	 *
	 * Sets the flag for how the ads should load. By default, the setting is off,
	 * so it will send 'on' when it's set to lazy load, rather than
	 * the normal way.
	 *
	 * @since  0.4.0
	 * @access public
	 *
	 * @param string $val
	 *
	 * @return bool
	 */
	public function set_lazy_loading( $val ) {
		$this->lazy = ( $val == 'on' ? false : true );

		return ( isset( $this->lazy ) ? $this->lazy : false );
	}

	/**
	 * Sets all ad targeting
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @return mixed
	 */
	public function set_targeting() {
		// Page Title
		$this->page_targeting['Page'] = $this->get_page_targeting();
    // Categories
    if( $this->page_targeting['Page'][0] == 'Home'){
      $this->page_targeting['Category'] = ['Home'];
    }else{
      $this->page_targeting['Category'] = $this->get_category_targeting();
    }
		// Tags
		$this->page_targeting['Tag'] = $this->get_tag_targeting();
		// SecEme
		//$this->page_targeting['SecEme'] = $this->get_category_targeting();
	}

  /**
	 * Set Debug
	 *
	 * Sets the flag for debugging info to show up
	 *
	 * @since  1.0.0
	 * @access public
	 *
	 * @param string $val
	 *
	 * @return bool
	 */
	public function set_dfp_debug( $val ) {
		$this->dfp_debug = ( $val == 'on' ? true : false );

		return ( isset( $this->dfp_debug ) ? $this->dfp_debug : false );
	}

	/**
	 * @param DFP_Ads $dfp_ads
	 *
	 * @return DFP_Ads
	 */
	public function send_ads_to_js( $dfp_ads ) {
		// Copy the original
		$object = clone $this;

		$object->set_targeting();
		$object->positions   = dfp_get_ad_positions();
		$object->script_name = null;
		$object->dir_uri     = null;

		return $object;
	}

	/**
	 * Adds URL sections to targeting
	 *
	 * This function will return an array of page directories without the URL.
	 *
	 * Example: [ '2015', '10', '11', 'post_slug' ]
	 *
	 * @since  0.0.1
	 * @access protected
	 *
	 * @return array|string
	 */
	protected function get_page_targeting() {
		global $wp;
		/*
		 * WP Core replacement for the URL parsing being done before.
		 */
		if ( $wp->request != null ) {
			$current_url = $wp->request;
			$array       = explode( '/', $current_url );
		} else {
			$current_url = $wp->query_string;
			$url_parts   = explode( '=', $current_url );
			if ( count( $url_parts ) >= 2 ) {
				$array[ $url_parts[0] ] = $url_parts[1];
			} else {
				$array = array();
			}

		}

		return ( count( $array ) < 1 ? array( 'Home' ) : $array );
	}

	/**
	 * Sets the category targeting on the object
	 *
	 * @since  0.0.1
	 * @access protected
	 *
	 * @return array|string
	 */
	protected function get_category_targeting() {
		global $post;
		$targets = array();
		if ( $post ) {
			$categories = get_the_category( $post->ID );
			foreach ( $categories as $c ) {
				$cat       = get_category( $c );
				$targets[] = $cat->name;
			}
		}

		return ( count( $targets ) < 1 ? '' : $targets );
	}

	/**
	 * Sets the tag targeting on the object
	 *
	 * @since  0.0.1
	 * @access protected
	 *
	 * @return array|string
	 */
	protected function get_tag_targeting() {
		global $post;
		$targets = array();
		if ( $post ) {
			$tags = get_the_tags( $post->ID );
			if ( $tags ) {
				foreach ( $tags as $t ) {
                    $tag = get_tag($t);
					$targets[] = $tag->name;
				}
			}
		}

		return ( count( $targets ) < 1 ? '' : $targets );
	}

	/**
	 * Registers Scripts. Localizes data to interstitial_ad.js
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @return mixed
	 */
	public function scripts_and_styles() {
		if ( defined( 'DFP_CONCAT_SCRIPTS' ) && true === DFP_CONCAT_SCRIPTS ) {
			$gads_script_url    = $this->dir_uri . '/assets/js/google-ads.min.js';
			$dfp_ads_script_url = $this->dir_uri . '/assets/js/dfp-ads.min.js';
            $lazy_loading_script_url = $this->dir_uri . '/assets/js/lazy-loading.min.js';
		} else {
			$gads_script_url    = $this->dir_uri . '/assets/js/google-ads.js';
			$dfp_ads_script_url = $this->dir_uri . '/assets/js/dfp-ads.js';
            $lazy_loading_script_url = $this->dir_uri . '/assets/js/lazy-loading.js';

		}
		// Google Ads JS Script
		wp_register_script(
			$this->google_ad_script_name,
			'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
			array( 'jquery' ),
			false,
			false
		);
		/* Get the Final Ad Positions */
		$ad_positions = apply_filters( 'pre_dfp_ads_to_js', $this );
		// Send data to front end.
		wp_localize_script( $this->google_ad_script_name, 'dfp_ad_object', array( $ad_positions ) );
		wp_enqueue_script( $this->google_ad_script_name );
		// Preps the script
		wp_register_script(
			$this->script_name,
			$dfp_ads_script_url,
			array( $this->google_ad_script_name, 'jquery' ),
			false,
			false
		);
		wp_enqueue_script( $this->script_name );

		if(!$this->lazy){

			/* Including Lazy Loading
			wp_register_script(
				"lazy-loading",
				$lazy_loading_script_url,
				array( $this->script_name, $this->google_ad_script_name, 'jquery' ),
				false,
				true
			);
			wp_enqueue_script( 'lazy-loading' );*/
		}
	}

	/**
	 * Display Shortcode
	 *
	 * @since  0.0.1
	 * @access public
	 *
	 * @param $atts array
	 *
	 * @return mixed Returns HTML data for the position
	 */
	public function shortcode( $atts ) {
		$position = dfp_get_ad_position( $atts['id'] );

		return $position->get_position();
	}

}