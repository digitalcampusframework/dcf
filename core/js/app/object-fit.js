// Based on https://www.bmorecreativeinc.com/edge-object-fit-fallback-without-polyfill-modernizr/

var results = document.querySelector( '.dcf-objfit-check' );
var objectfit = window.getComputedStyle( results, '::before' ).content;
if( objectfit == 'none' ) {
  // Edge fallback
  // Javascript is nearly identical to the Medium article
  $( '.dcf-objfit-cover' ).parent( 'div' ).addClass( 'dcf-objfit-cover-fallback' );
  $( '.dcf-objfit-cover-fallback' ).each( function() {
    var $container = $( this ),
      imgUrl = $container.find( 'img' ).prop( 'src' );
    if( imgUrl ) {
      $container.css( 'backgroundImage', 'url(' + imgUrl + ')' );
    }
  });
}
