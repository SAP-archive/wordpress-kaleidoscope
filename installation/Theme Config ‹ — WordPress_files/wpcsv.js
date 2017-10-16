jQuery( function( ) {

	jQuery( 'div#wpcsv fieldset legend input' ).on( 'click', function( ) {
		if ( this.checked ) {
			jQuery( this ).parents( 'fieldset' ).find( 'input:not(:checked)' ).attr( 'checked', true );
		} else {
			jQuery( this ).parents( 'fieldset' ).find( 'input:checked' ).attr( 'checked', false );
		}
	});

	jQuery( 'div#wpcsv fieldset div input' ).on( 'click', function( ) {
		if ( this.checked ) {
			jQuery( this ).parents( 'fieldset' ).children( 'legend' ).children( 'input' ).attr( 'checked', true );
		} else if ( !jQuery( this ).parents( 'fieldset' ).find( 'input' ).is( ':checked' ) ) {
			jQuery( this ).parents( 'fieldset' ).children( 'legend' ).children( 'input' ).attr( 'checked', false );
		}
	});

	jQuery( 'div#wpcsv fieldset legend input' ).each( function( ) {
		if ( jQuery( this ).parents( 'fieldset' ).find( 'input' ).is( ':checked' ) ) {
			this.checked = true;
		}
	});
	
	jQuery( 'a#wpcsv-type-status-toggle-all-on' ).on( 'click', function( e ) {
		jQuery( 'div#filters .wpcsv-type, div#filters .wpcsv-status' ).attr( 'checked', true );
		e.preventDefault( );
		return false;
	});

	jQuery( 'a#wpcsv-type-status-toggle-all-off' ).on( 'click', function( e ) {
		jQuery( 'div#filters .wpcsv-type, div#filters .wpcsv-status' ).attr( 'checked', false );
		e.preventDefault( );
		return false;
	});
});
