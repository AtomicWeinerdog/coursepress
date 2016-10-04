/*!  - v2.0.0
 * 
 * Copyright (c) 2016; * Licensed GPLv2+ */
var CoursePress = {};
CoursePress.Events = _.extend( {}, Backbone.Events );

(function( $ ) {

CoursePress.SendRequest = Backbone.Model.extend( {
	url: _coursepress._ajax_url + '?action=coursepress_request',
	parse: function( response ) {
		var action = this.get( 'action' );

		// Trigger course update events
		if ( true === response.success ) {
			this.set( 'response_data', response.data );
			this.trigger( 'coursepress:' + action + '_success', response.data );
		} else {
			this.set( 'response_data', {} );
			this.trigger( 'coursepress:' + action + '_error', response.data );
		}
	}
} );

/** Reset browser URL **/
CoursePress.resetBrowserURL = function( url ) {
	if ( window.history.pushState ) {
		// Reset browser url
		window.history.pushState( {}, null, url );
	}
};

/** Focus to the element **/
CoursePress.Focus = function( selector ) {
	var el = $( selector ), top;

	if ( 0 < el.length ) {
		top = el.offset().top;
		top -= 100;

		$(window).scrollTop( top );
	}

	return false;
};

/** Error Box **/
CoursePress.showError = function( error_message, container ) {
	var error_box = $( '<div class="cp-error-box"></div>' ),
		error = $( '<p>' ),
		closed = $( '<a class="cp-closed">&times;</a>' ),
		removeError
	;

	removeError = function() {
		error_box.remove();
	};

	error.html( error_message ).appendTo( error_box );
	closed.prependTo( error_box ).on( 'click', removeError );

	container.prepend( error_box );

	// Focus on the error box
	CoursePress.Focus( '.cp-error-box' );
};

/** Loader Mask **/
CoursePress.Mask = function( selector ) {
	selector = ! selector ? 'body' : selector;

	var mask = $( '<div class="cp-mask mask"></div>' );
	mask.appendTo( selector );

	return {
		mask: mask,
		done: function() {
			mask.remove();
		}
	};
};

/** Unit Progress **/
CoursePress.UnitProgressIndicator = function() {
	var a_col = $( 'ul.units-archive-list a' ).css('color');
	var p_col = $( 'body' ).css('color').replace('rgb(', '' ).replace(')', '' ).split( ',');
	var emptyFill = 'rgba(' + p_col[0] + ', ' + p_col[1] + ', ' + p_col[2] + ', 1)';

	var item_data = $( this ).data();
	var text_color = a_col;
	var text_align = 'center';
	var text_denominator = 4.5;
	var text_show = true;
	var animation = { duration: 1200, easing: "circleProgressEase" };

	if ( item_data.knobFgColor ) {
		a_col = item_data.knobFgColor;
	}
	if ( item_data.knobEmptyColor) {
		emptyFill = item_data.knobEmptyColor;
	}
	if ( item_data.knobTextColor ) {
		text_color = item_data.knobTextColor;
	}
	if ( item_data.knobTextAlign ) {
		text_align = item_data.knobTextAlign;
	}
	if ( item_data.knobTextDenominator ) {
		text_denominator = item_data.knobTextDenominator;
	}
	if ( 'undefined' !== typeof( item_data.knobTextShow ) ) {
		text_show = item_data.knobTextShow;
	}
	if ( 'undefined' !== typeof( item_data.knobAnimation ) ) {
		animation = item_data.knobAnimation;
	}

	var init = { color: a_col };
	$( this ).circleProgress( { fill: init, emptyFill: emptyFill, animation: animation } );

	var parent = $( this ).parents('ul')[0];

	$( this ).on( 'circle-animation-progress', function( e, v ) {
		var obj = $( this ).data( 'circle-progress' ),
			ctx = obj.ctx,
			s = obj.size,
			sv = (100 * v).toFixed(),
			ov = (100 * obj.value ).toFixed();
			sv = 100 - sv;

		if ( sv < ov ) {
			sv = ov;
		}
		ctx.save();

		if ( text_show ) {
			ctx.font = s / text_denominator + 'px sans-serif';
			ctx.textAlign = text_align;
			ctx.textBaseline = 'middle';
			ctx.fillStyle = text_color;
			ctx.fillText( sv + '%', s / 2 + s / 80, s / 2 );
		}
		ctx.restore();
	} );

	$( this ).on( 'circle-animation-end', function() {
		var obj = $( this ).data( 'circle-progress' ),
			ctx = obj.ctx,
			s = obj.size,
			sv = (100 * obj.value ).toFixed();
			obj.drawFrame( obj.value );

		if ( text_show ) {
			ctx.font = s / text_denominator + 'px sans-serif';
			ctx.textAlign = text_align;
			ctx.textBaseline = 'middle';
			ctx.fillStyle = text_color;
			ctx.fillText( sv + '%', s / 2, s / 2 );
		}
	} );

	// In case animation doesn't run
	var obj = $( this ).data( 'circle-progress' ),
		ctx = obj.ctx,
		s = obj.size,
		sv = (100 * obj.value ).toFixed();

	if ( text_show ) {
		ctx.font = s / text_denominator + 'px sans-serif';
		ctx.textAlign = text_align;
		ctx.textBaseline = 'middle';
		ctx.fillStyle = text_color;
		ctx.fillText( sv + '%', s / 2, s / 2 + s / 80 );
	}

	if (  'undefined' !== typeof( item_data.knobTextPrepend ) && item_data.knobTextPrepend ) {
		$( this ).parent().prepend(  '<span class="progress">'+sv + '%</span>' );
	}
};

// Hook into document
$(document).ready(function() {
	$('.course-progress-disc' ).each( CoursePress.UnitProgressIndicator );
});

})(jQuery);
(function( $ ) {
	CoursePress.LoadFocusModule = function() {
		var nav = $(this),
			data = nav.data(),
			container = $( '.coursepress-focus-view' ),
			url = [ _coursepress.home_url, 'coursepress_focus' ]
		;

		if ( 'submit' === nav.attr( 'type' ) ) {
			// It's a submit button, continue submission
			return;
		}
		if ( 'course' === data.type ) {
			// Reload
			window.location = data.url;
			return;
		}

		url.push( data.course, data.unit, data.type, data.id );
		url = url.join( '/' );
		container.load( url );
		CoursePress.resetBrowserURL( data.url );

		return false;
	};

	CoursePress.ModuleSubmit = function() {
		var form = $(this),
			error_box = form.find( '.cp-error' ),
			focus_box = form.parents( '.coursepress-focus-view' ),
			iframe = false,
			timer = false
		;

		if ( 0 === error_box.length ) {
			error_box = $( '<div class="cp-error">' ).prependTo( form );
		}

		// Insert ajax marker
		form.append( '<input type="hidden" name="is_cp_ajax" value="1" />' );

		// Create iframe to trick the browser
		iframe = $( '<iframe name="cp_submitter" style="display:none;">' ).insertBefore( form );

		// Set the form to submit unto the iframe
		form.attr( 'target', 'cp_submitter' );

		// Apply tricks
		iframe.on( 'load', function() {
			var that = $(this).contents().find( 'body' );

			timer = setInterval(function() {
				var html = that.text();

				if ( '' != html ) {
					// Kill timer
					clearInterval( timer );

					var data = window.JSON.parse( html );

					if ( true === data.success ) {
						// Process success
						if ( data.data.url ) {
							if ( data.data.type && 'completion' === data.data.type ) {
								window.location = data.data.url;
							} else {
								focus_box.html( data.data.html );
								CoursePress.resetBrowserURL( data.data.url );
							}
						}
					} else {
						// Print error message
						error_box.empty().append( data.data.error_message );
					}
				}
			}, 100 );
		});
	};

	CoursePress.toggleModuleState = function() {
		var button = $(this),
			parentDiv = button.closest( '.cp-module-content' ),
			elementsDiv = $( '.module-elements', parentDiv ),
			responseDiv = $( '.module-response', parentDiv )
		;

		responseDiv.hide();
		elementsDiv.show();

		return false;
	};

	// Recreate comment-reply js
	CoursePress.commentReplyLink = function() {
		var link = $(this),
			datacom = link.parents( '[data-comid]' ).first(),
			com_id = datacom.data( 'comid' ),
			module_content = link.parents( '.cp-module-content' ).first(),
			form = $( '#respond', module_content ),
			comment_div = $( '#comment-' + com_id ),
			comment_parent = $( '[name="comment_parent"]', form ),
			tempDiv = $( '.cp-temp-div' ),
			cancel_link = form.find( '#cancel-comment-reply-link' )
		;

		// Add marker to the original form position
		if ( 0 === tempDiv.length ) {
			tempDiv = $( '<div class="cp-temp-div"></div>' ).insertAfter( form );
		}

		comment_parent.val( com_id );
		comment_div.append( form );

		cancel_link.show().on( 'click', function() {
			form.insertBefore( tempDiv );
			cancel_link.hide();
			tempDiv.remove();

			return false;
		});

		// Focus to the form
		CoursePress.Focus( form );

		return false;
	};

	CoursePress.addComment = function(ev) {
		var button = $(this),
			module_content = button.parents( '.cp-module-content' ).first(),
			form = $( '#respond', module_content ),
			cp_form = $( '.cp-comment-form', module_content ),
			comment = $( '[name="comment"]', form ),
			comment_parent = $( '[name="comment_parent"]', form ),
			comment_post_ID = $( '[name="comment_post_ID"]', form ),
			subscribe = $( '[name="coursepress_subscribe"]', form ),
			student_id = $( '[name="student_id"]', module_content ),
			course_id = $( '[name="course_id"]', module_content ),
			unit_id = $( '[name="module_content"]', module_content ),
			cp_error = $( '.cp-error-box', form ),
			comment_list = $( '.comment-list', module_content ),
			params = {},
			is_reply = 0 < parseInt( comment_parent.val() ),
			request = new CoursePress.SendRequest(),
			restore_form,
			mask
		;

		// Remove previous error box
		cp_error.remove();

		if ( '' === comment.val() ) {
			// Alert the user
			CoursePress.showError( _coursepress.comments.require_valid_comment, form );

			// Prevent the form from submitting
			ev.stopImmediatePropagation();
			return false;
		}

		params = {
			comment: comment.val(),
			comment_parent: comment_parent.val(),
			comment_post_ID: comment_post_ID.val(),
			subscribe: subscribe.val(),
			cpnonce: _coursepress.cpnonce,
			method: 'add_single_comment',
			className: 'CoursePress_Module',
			course_id: course_id,
			unit_id: unit_id,
			student_id: student_id,
			action: 'add_single_comment'
		};

		mask = CoursePress.Mask();
		restore_form = function() {
			var cancel_link = form.find( '#cancel-comment-reply-link' );

			comment.val( '' );
			comment_parent.val( '' );

			if ( cancel_link.is( ':visible' ) ) {
				cancel_link.trigger( 'click' );
			}

			// Remove cover mask
			mask.done();
		};


		request.set( params );
		request.off( 'coursepress:add_single_comment_success' );
		request.on( 'coursepress:add_single_comment_success', function( data ) {
			// Restore the form to it's orig position
			restore_form();

			if ( 0 < comment_list ) {
				comment_list = $( '<ol class="comment-list"></ol>' ).insertAfter( form );
			}

			var current_parent = comment_list,
				insert_type = cp_form.is( '.comment-form-desc' ) ? 'append' : 'prepend',
				child_list;

			if ( true === is_reply ) {
				current_parent = $( '#comment-' + params.comment_parent );
				child_list = current_parent.find( '.children' );

				if ( 0 === child_list.length ) {
					// Create a new .children ul
					current_parent.append( '<ul class="children"></ul>' );
					child_list = current_parent.find( '.children' );
				} else {
					child_list = 'append' === insert_type ? child_list.last() : child_list.first();
				}
				child_list[ insert_type ]( data.html );
			} else {
				current_parent[ insert_type ]( data.html );
			}

			// Focus to the last inserted comment
			CoursePress.Focus( '#comment-' + data.comment_id );
		} );
		request.on( 'coursepress:add_single_comment_error', function() {
			// Remove cover mask
			mask.done();
			// Alert the user
			CoursePress.showError( _coursepress.server_error, form );
		});
		request.save();

		// Prevent the form from submitting
		ev.stopImmediatePropagation();

		return false;
	};

	$( document )
		.on( 'submit', '.cp-form', CoursePress.ModuleSubmit )
		.on( 'click', '.focus-nav-prev, .focus-nav-next', CoursePress.LoadFocusModule )
		.on( 'click', '.button-reload-module', CoursePress.toggleModuleState )
		.on( 'click', '.cp-module-content .comment-reply-link', CoursePress.commentReplyLink )
		.on( 'click', '.cp-comment-submit', CoursePress.addComment );

})(jQuery);