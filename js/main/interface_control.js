/**
 * 
 * Interface Control jQuery
 * Version 0.2 (201312)
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @author RafMas 
 * @since 2012
 *
 **/

/*jslint browser: true*/
/*global $, jQuery, alert */
/*
	gotoedition, gotopage, 
	updateSelectLength, 
	UnInitialize, UnInitializeHS, 
	chooseZoomMag, setMagHeight,
	checkAnnPosHS
	enableITLbutton, disableITLbutton,
	enableHSbutton,	disableHSbutton,
	ITLon, HSon,
	Initialize, InitializeHS,
	fitFrame, preload
*/

$(function() {

	"use strict";

	//IT: Setting variabili generiche
	var keycount, fulltogg;
	var first_pp, last_pp;
	var first_dd, last_dd;
	keycount = 0;
	fulltogg = false;
	//var pp_temp_val=$(".main_pp_select").val();

	$.ajaxSetup({
		contentType: 'text/html;charset=utf-8'
	});
	$.ajaxSetup({
		'beforeSend' : function(xhr) {
			xhr.overrideMimeType('text/html; charset=utf-8');
		}
	});


	$.ajax({
		type: "GET",
		url: "data/output_data/structure.xml",
		dataType: "xml",
		success: function(xml) {
			//Edition
			$(xml).find('editions edition').each(function(){
				var current_id = $(this).text();
				$('.main_ee_select .option_container').append(
					$('<div/>')
						.attr("data-value", current_id)
						.addClass('option')
						.text(current_id)
				);
			});
			
			if($(xml).find('editions edition').length <= 1){
				$('#txttxt_link').remove();
				$('div.concave, div.extTop').css('width', '200px');
				$('div.botleftconcave').css('width', '176px');
			}

			$(".main_ee_select .option_container div:first-child").addClass( "selected" );

			$('.main_ee_select .label_selected')
				.text($('.main_ee_select .option_container div:first').text())
				.attr("data-value", $('.main_ee_select .option_container div:first').text());


			first_pp = $(xml).find('pages pair pb').first().text();
			last_pp = $(xml).find('pages pair pb').last().text();

			var f_pair, l_pair;
			f_pair = $(xml).find('pages pair').first().children('pb').eq(0).text();
			l_pair = $(xml).find('pages pair').first().children('pb').eq(1).text()
			first_dd = f_pair + "-" + l_pair;

			f_pair = $(xml).find('pages pair').last().children('pb').eq(0).text();
			l_pair = $(xml).find('pages pair').last().children('pb').eq(1).text()
			last_dd = f_pair + "-" + l_pair;

			
			//Page_dd
			$(xml).find('pages pair').each(function(){
				var current_id, first_page_d, second_page_d;
				var current_label, first_label_d, second_label_d;
				var first_text_ref, second_text_ref;

				first_page_d = $(this).children('pb').eq(0).text();
				first_label_d = $(this).children('pb').eq(0).attr("n") != "" ? $(this).children('pb').eq(0).attr("n") : first_page_d;
				second_page_d = $(this).children('pb').eq(1).text();
				second_label_d = $(this).children('pb').eq(1).attr("n") != "" ? $(this).children('pb').eq(1).attr("n") : second_page_d;
				
				current_id = "";
				current_label = "";

				first_text_ref = $(xml)
					.find('textpage text')
					.find('pb:contains("'+first_page_d+'")')
					.parent().attr('n');
				first_text_ref = first_text_ref.replace(/\s+/g, '');
				
				if (second_page_d !== ""){
					current_id = first_page_d+"-"+second_page_d;
					current_label = first_label_d+"-"+second_label_d;
				}
				else{
					current_id = first_page_d;
					current_label = first_label_d+"-(miss)";
				}

				$('.main_dd_select .option_container').append(
    				$('<div/>')
    					.attr("data-value", current_id)
    					.attr("data-first-page-first-doc", first_text_ref)
						.addClass('option')
						.text(current_label)
    			);
			});
			$('.main_dd_select .option_container div:first-child').addClass('selected');
			$('.main_dd_select .label_selected')
				.text($('.main_dd_select .option_container div:first').text())
				.attr("data-value", $('.main_dd_select .option_container div:first').attr("data-value"))
				.attr("data-first-doc", $('.main_dd_select .option_container div:first').attr("data-first-page-first-doc"));


			//Text and Page
			$(xml).find('textpage text').each(function(){
				var current_id, current_label, first_page_id;
				current_label = $(this).attr("n");
				current_id = current_label.replace(/\s+/g, '');
				first_page_id = $(this).find(":first-child").text();
				$('.main_tt_select .option_container').append(
					$('<div/>')
						.attr("data-value", current_id)
						.attr("data-first-page", first_page_id)
						.attr("title", current_label)
						.addClass('option')
						.text(cropLongTextLabel(current_label, 18))
				);
				
				$(this).find('pb').each(function(){
    				var page_current_id = $(this).text();
    				var page_current_label = $(this).attr("n");
    				if( $(".main_pp_select .option_container .option[data-value='"+page_current_id+"']").length <= 0){
    					$('.main_pp_select .option_container').append(
	    					$('<div/>')
	    						.attr("data-value", page_current_id)
	    						.attr("data-first-doc", current_id)
	    						.addClass('option')
	    						.text(page_current_label)
	    				);
    				}
    				if ( $("#thumb_cont figure[data-value='"+page_current_id+"']" ).length <= 0 ) {
    					
    					var figure = $('<figure/>')
		    					.addClass('thumb_single')
		    					.attr('data-value', page_current_id)
		    					.attr('data-first-doc', current_id);
		    			
		    			$('<img />')
		    				.attr('src', 'data/input_data/images/single/'+page_current_id+'_small.jpg')
		    				.appendTo(figure);
		    			
		    			$('<figcaption />')
		    				.text(page_current_label)
		    				.appendTo(figure);

		    			$('#thumb_cont').append(figure);

		    			$("img").error(function () {
						  $(this)
						  	.unbind("error")
						  	.attr("src", "images/no-image.png")
						  	.css('opacity', '0.3');
						});
    				}
				})
			});
			$('.main_tt_select .option_container div:first-child').addClass('selected');
			$('.main_tt_select .label_selected')
				.text($('.main_tt_select .option_container div:first').text())
				.attr("data-value", $('.main_tt_select .option_container div:first').attr('data-value'));
            
            $('.main_pp_select .option_container div:first-child').addClass('selected');

			$('.main_pp_select .label_selected')
				.text($('.main_pp_select .option_container .option:first').text())
				.attr("data-value", $('.main_pp_select .option_container .option:first').attr("data-value"))
				.attr("data-first-doc", $('.main_pp_select .option_container .option:first').attr("data-first-doc"));
			
			$(".like_select.filter").each(function(){
				if ( $(this).find('.option_container .option').length <= 2 ) { // ci sono solo gli elementi "Seleziona tutto" e "Pulisci selezione"
					$(this).remove();
				}
			});

			/* Gestione eventi */

			/* Lanciato dal click sulla thumbnail */
			/* Recupera l'identificativo della pagina di sx e di quella di dx dall'hash se impostato 
			   (altrimenti dal selettore delle pagine singole)
			   e aggiorna l'hash che poi provocherà il caricamento della nuova immagine */
			$(".main_dd_select").on('imgd_thumb',function(){
				var hash_parts, temp_pp, temp_tt, first_page, second_page, newhash;
				var first_page_lab, second_page_lab, newlab;
				
				hash_parts = new Array();
				hash_parts = location.hash.substr(1).split('&');
				if ( hash_parts != "" ) {
					for (var i = 0; i < hash_parts.length; i++) {
					    if(hash_parts[i].indexOf("page") === 0) {
					        temp_pp = hash_parts[i].substr(5);
					    }
					    else if(hash_parts[i].indexOf("doc") === 0) {
					     	temp_tt = hash_parts[i].substr(4);   
					    }
					}
				} else {
					temp_pp = $('.main_pp_select .option_container .option:first-child').attr('data-value');
					temp_tt = $('.main_pp_select .option_container .option:first-child').attr('data-first-doc');
				}

				// first page of bookreader
				first_page = $(xml)
					.find('pair:contains('+temp_pp+')')
					.children()
					.eq(0).text();
				first_page_lab = $(xml)
					.find('pair:contains('+temp_pp+')')
					.children()
					.eq(0).attr("n");
				first_page_lab = first_page_lab != "" ? first_page_lab : first_page;

				// second page of bookreader
				second_page = $(xml)
					.find('pair:contains('+temp_pp+')')
					.children()
					.eq(1).text();
				second_page_lab = $(xml)
					.find('pair:contains('+temp_pp+')')
					.children()
					.eq(1).attr("n");
				second_page_lab = second_page_lab != "" ? second_page_lab : second_page;

				if (typeof(second_page_lab) == 'undefined'){
					newhash = first_page;
					second_page_lab = "(miss)";
				} else {
					newhash = first_page+"-"+second_page;
				}
				newlab = first_page_lab+"-"+second_page_lab;
				$(".main_dd_select .label_selected")
					.text(newlab)
					.attr("data-value", newhash)
					.attr("data-first-doc", temp_tt);

				window.location.hash = "doc="+temp_tt+"&page="+newhash;
			});
			
			/* Lanciato sul click della modalità bookreader */
			/* Recupera l'identificativo della pagina di sx e di quella di dx dal selettore delle pagine singole
			   e aggiorna l'hash che poi provocherà il caricamento della nuova immagine */
			$(".main_dd_select").on('imgd_mode',function(){
				var temp_pp, temp_tt, first_page, second_page, newhash;
				var first_page_lab, second_page_lab, newlab;
				temp_pp = $(".main_pp_select .label_selected").attr("data-value");
				temp_tt = $(".main_pp_select .label_selected").attr("data-first-doc");

				// first page of bookreader
				first_page = $(xml)
					.find('pair:contains('+temp_pp+')')
						.children()
							.eq(0).text();
				first_page_lab = $(xml)
					.find('pair:contains('+temp_pp+')')
						.children()
							.eq(0).attr("n");
				first_page_lab = first_page_lab != "" ? first_page_lab : first_page;
				
				// second page of bookreader
				second_page = $(xml)
					.find('pair:contains('+temp_pp+')')
						.children()
							.eq(1).text();
				second_page_lab = $(xml)
					.find('pair:contains('+temp_pp+')')
						.children()
							.eq(1).attr("n");
				second_page_lab = second_page_lab != "" ? second_page_lab : second_page;
				if (typeof(second_page_lab) == 'undefined'){
					newhash = first_page;
					second_page_lab = "(miss)";
				} else {
					newhash = first_page+"-"+second_page;
				}
				
				newlab = first_page_lab+" - "+second_page_lab;
				$(".main_dd_select .label_selected")
					.text(newlab)
					.attr("data-value", newhash)
					.attr("data-first-doc", temp_tt)
					.attr('data-last-hash-txtimg', location.hash.substr(1));;
				updateHash(temp_tt, newhash);
			});

			/* Apertura option container dei selettori a tendina */
			$(".open_select").click(function(){
				if ( !$(this).parents('.like_select').hasClass('not_active') ){
					if (!($(".option_container").is(':animated'))){
						if($('.option_container:visible').parents('.like_select').attr('id') !== $(this).parents('.like_select').attr('id')){
						   $('.option_container.up:visible').animate({
						       top: '-5px',
						       height:"toggle"
						   }, 400);	
						   $('.option_container.down:visible').animate({height:"toggle"}, 400);   
						}
						if($(this).hasClass('open_up')){
						   if ($(this).siblings('.option_container').is(':visible')) {
						       $(this).siblings('.option_container').animate({
	    					       top: '-5px',
	    					       height:"toggle"
	    					   }, 400);
						   } else {
						   		var top = "-" + $(this).siblings('.option_container').attr('data-toggle-top') + "px";
	    					   	$(this).siblings('.option_container').animate({
	    					       top: top,
	    					       height:"toggle"
	    					   }, 400);
	    				   }
						} else {
						    /* prova scroll ... sistemare
						    var height = $(this).siblings('.option_container').find('.option').height();
							var selected = $(this).siblings('.option_container').find('.option.selected').index();    
							var scroll = height*selected;

						    $(this).siblings('.option_container').animate({
						    	height:"toggle"
						    }, 400, function(){
						    	if ($(this).scrollTop()+20 != scroll ) {
						    		$(this).animate({
									  scrollTop: scroll
									}, 500);
						    	}
						    });*/
							$(this).siblings('.option_container').animate({
						    	height:"toggle"
						    }, 400);
						}
					}
				}
			});

			/* APERTURA TOOLTIP PAGE */
			/* Recupera gli identificativi della pagina selezionata e del primo documento in essa contenuto. 
			   Ricerca gli altri testi che iniziano sulla stessa pagina 
			   e aggiorna il contenuto del tooltip con tale elenco. */
			
			// #CDP - Aggiungere controllo per avere il tooltip solo se esiste almeno un caso di pagina con più doc sopra
			$('<span/>')
				.addClass('option_tooltip')
				.prependTo('.main_pp_select');			
			
			$(".main_pp_select .option_container .option").hover(function(e) {
				var first_doc, pp_val, tt_val, temp_tt, docs;
				
				pp_val = $(this).attr('data-value');
				tt_val = $(this).attr('data-first-doc');
				first_doc = $("#span_tt_select .option_container .option[data-value='"+tt_val+"']").text();
				docs = "";
				$("#span_tt_select .option_container .option[data-first-page='"+pp_val+"']").each(function(){
					if($(this).attr('data-value') != tt_val){
						temp_tt = $(this).text();
						docs += "<br />"+temp_tt;
					}
				});
				if (docs == "") {	
					docs = "Documento:<br />"+first_doc;
				} else {
					docs = "Documenti:<br />"+first_doc+docs;
				}
				$("#span_pp_select .option_tooltip")
					.append(docs)
					.show()
					.offset({ top: ($(this).offset().top) });
			}, function(){
				$("#span_pp_select .option_tooltip")
					.empty()
					.hide();
			});

			/* SELECT PAGE */
			/* Recupera gli identificativi (e la label) della pagina selezionata e del primo documento in essa contenuto.  
			   Aggiorna l'hash che provoca il reload della pagina.
			*/
			$(".main_pp_select .option_container .option").click(function(){
				if(! $(this).hasClass('selected')){
					var new_pp_val, new_pp_lab, new_tt_val;
					var current_tt_val, current_tt_first_page;
					
					new_pp_val = $(this).attr('data-value'); // id pagina cliccata
					new_pp_lab = $(this).text(); 
					new_tt_val = $(this).attr('data-first-doc'); // primo documento contenuto.
					
					/* Se il documento correntemente selezionato (current_tt_val) è contenuto nella pagina in questione, 
				   	   aggiorno il contenuto testuale non con il primo documento della pagina, ma con quello corrispondente current_tt_val.
				   	   Altrimenti aggiorno con il primo documento della pagina. */
					current_tt_val = $(".main_tt_select .label_selected").attr("data-value"); 
					current_tt_first_page = $(".main_tt_select .option_container .option.selected").attr('data-first-page');
					if(current_tt_first_page === new_pp_val){
						updateHash(current_tt_val, new_pp_val, "");
					} else {
						updateHash(new_tt_val, new_pp_val, "");
					}
					$(this).removeClass('selected');
				}
			});

			/* SELECT TEXT */
			$('.main_tt_select .option_container .option').click(function() {
				if(! $(this).hasClass('selected')){
					var new_tt_opt, new_tt_val, new_tt_first_page;
					var current_pp_val;

					var tt_val_temp, first_page;
					
					new_tt_opt = $(this);
					new_tt_val = $(this).attr('data-value');
					new_tt_first_page = new_tt_opt.attr('data-first-page');

					current_pp_val = $('#span_pp_select .label_selected').attr('data-value');
					
					/* Se la prima pagina del documento non è la corrente, 
						aggiorno il contenuto del frame testuale con quello della pagina in qustione.
						Altrimenti aggiorno solo le info legate al testo.
					*/
					if (current_pp_val != new_tt_first_page) {
						var new_tt_first_page_lab;
						new_tt_first_page_lab = $("#span_pp_select .option_container ")
													.find(".option[data-value='"+new_tt_first_page+"']").text();
					} else {
						$("#text_cont .doc[data-doc!='"+new_tt_val+"']").hide();
					}
					updateHash(new_tt_val, new_tt_first_page, "");
					$(this).removeClass('selected');
				}
			});

			/* SELECT EDITION LEVEL / SWITCH ON/OFF REGESTO */
			$('.main_ee_select .option_container .option').click(function(){
				if ( ! $(this).hasClass('selected') ) {
					// #CDP. Se il regesto è visibile, lo chiudo
					var regesto_button, regesto_cont;
					var temp_frame, temp_parent;
					var other_frame, other_parent;
					var other_ee_select, other_ee_select_val;
					var pp_val, ee_val;
    				var tt_val;
    				
    				pp_val = $('#span_pp_select .label_selected').attr('data-value');
    				tt_val = $('#span_pp_select .label_selected').attr('data-first-doc');
    				ee_val = $(this).text().toLowerCase();

    				temp_frame = "";
    				temp_parent = "";

    				other_frame = "";
    				other_parent = "";
					// Edition Select in text-add frame
					if ($(this).parents(".like_select").attr("id") === "span_ee_select-add") {
						regesto_button = "#switchReg-add";
						regesto_cont = "#regesto_cont-add";

						other_ee_select_val = $('#span_ee_select .label_selected').text().toLowerCase();
						// se sto cliccando lo stesso livello di edizione dell'altro frame
						if ( other_ee_select_val === ee_val ) {
							other_frame = "text_elem";
							other_parent = "text_cont";
							other_ee_select = "#span_ee_select";
						}
						
						temp_frame = "text_elem-add";
    					temp_parent = "text_cont-add";

    					if ( $('#main_right_frame .like_select.filter').find('.option.selected').length > 0 ) {
							$('#main_right_frame .like_select.filter').find('.option.selected').each(function() {
								var left_filter = "#"+$(this).parents('.like_select').attr('id')+"-add"; 
								if ( $(left_filter).find('.label_selected').attr('data-value') == 'none' ){
									var value = $(this).attr('data-value');
									$(left_filter)
										.find(".option[data-value='"+value+"']")
										.addClass('selected');
								}
							});
						}

					} 
					// Main Edition Select
					else {
						regesto_button = "#switchReg";
						regesto_cont = "#regesto_cont";

						other_ee_select_val = $('#span_ee_select-add .label_selected').text().toLowerCase();

						if ( other_ee_select_val === ee_val ) {
							other_frame = "text_elem-add";
							other_parent = "text_cont-add";
							other_ee_select = "#span_ee_select-add";
						}

						temp_frame = "text_elem";
    					temp_parent = "text_cont";
					}
					
					if ( ee_val != 'diplomatic' ){ // Disattivare filtri liste nell'edizione diplomatica
						$("#"+temp_parent)
							.parents("div[id*='frame']")
								.find('.like_select.filter')
									.css('opacity', "1")
									.removeClass('not_active'); 
					} else {
						$("#"+temp_parent)
							.parents("div[id*='frame']")
								.find('.like_select.filter')
									.css('opacity', "0.5")
									.addClass('not_active'); 
					}

					if ($(regesto_cont).is(":visible")) {
						$(regesto_button).trigger('click');
					}

    				if ( other_frame != "" && other_parent != "" ) {
    					var other_ee_elem, other_ee_val;
    					if( $(other_ee_select).find('.option.selected').next().length > 0 ) {
    						other_ee_elem = $(other_ee_select).find('.option.selected').next()
    					} else {
    						other_ee_elem = $(other_ee_select).find('.option.selected').prev();
    					}
    					other_ee_val = other_ee_elem.attr('data-value').toLowerCase();
    					other_ee_elem
    						.addClass('selected')
    						.siblings('.selected')
    							.removeClass('selected');

    					$(other_ee_select)
    						.find('.label_selected')
    							.attr('data-value', other_ee_val)
    							.text(other_ee_elem.text());

						if ( (other_ee_val != 'diplomatic') &&
							 (!$("#"+other_parent).parents("div[id*='frame']").find('.toggleReg').hasClass('active'))){ // Disattivare filtri liste nell'edizione diplomatica
							
							$("#"+other_parent)
							.parents("div[id*='frame']")
								.find('.like_select.filter')
									.css('opacity', "1")
									.removeClass('not_active'); 
						} else {
							
							$("#"+other_parent)
								.parents("div[id*='frame']")
									.find('.like_select.filter')
										.css('opacity', "0.5")
										.addClass('not_active'); 
						}

    					gotoedition(pp_val, other_ee_val, other_frame, other_parent);
    				}
    				gotoedition(pp_val, ee_val, temp_frame, temp_parent);
				}
			});
			
			/* SELECT DOUBLE PAGE NAVIGATION */
			$('.main_dd_select .option_container .option').click(function(){
				var pp_val, pp_lab, tt_val, first_page_id;
				pp_val = $(this).attr('data-value');
				tt_val = $(this).attr('data-first-page-first-doc');
				pp_lab = $(this).text();
				$('#span_dd_select .label_selected')
					.attr("data-value", pp_val)
					.attr("data-first-doc", tt_val)
					.attr('data-last-hash-txtimg', '')
					.text(pp_lab);
				first_page_id = pp_val.split('-')[0];
				$("#span_pp_select .option_container .option[data-value='"+first_page_id+"']").trigger('click');				
				updateHash(tt_val, pp_val, "");
				$(this).removeClass('selected');
			});

			/* CLICK SU OPTION IN SELECT */
			/* General event on click on ".option" in a ".filter" ".like_select" */
			$(".like_select.filter .option_container .option").click(function(){
				var classToBeActived, newLabel, newLabelVal, filtersActive;
				classToBeActived = $(this).attr('data-value');
				if (classToBeActived == 'clean') { //pulisci selezione
				    $(this).siblings('.option').removeClass('selected');
				    $(this).addClass('selected');
				    $(this).parents("div[id*='frame']").find('.list_active').removeClass('list_active');
				    // se "pulisci selezione" l'etichetta prende "No selection"
			        newLabel = "No selection";
			        newLabelVal = "clean";
				} else if (classToBeActived == 'all') { //seleziona tutto
				    $(this).addClass('selected');
				    $(this).siblings('.option').each(function(){
				        classToBeActived = $(this).attr('data-value');
				        if (classToBeActived != 'clean') {
				            $(this).addClass('selected');
				            $(this).parents("div[id*='frame']").find("."+classToBeActived).addClass('list_active');
				        } 
				        $(this).siblings(".option[data-value='clean']").removeClass('selected');
				    });
				    newLabel = "Multi selection";
				    newLabelVal = "multi";
				} else {
				   $(this).toggleClass('selected');
				   $(this).parents("div[id*='frame']").find("."+classToBeActived).toggleClass('list_active');
				   $(this).siblings(".option[data-value='clean']").removeClass('selected');
				   $(this).siblings(".option[data-value='all']").removeClass('selected');
				   
				   filtersActive = $(this).parents('.option_container').find('.option.selected').length;
				   switch(filtersActive){
				       case 1:
				                newLabel = $(this).parents('.option_container').find('.option.selected').text();
				                newLabelVal = $(this).parents('.option_container').find('.option.selected').attr('data-value');
				                break;
				       case 0:
				                newLabel = "No selection";
				                newLabelVal = "clean";
				                break;
				       default:
				                newLabel = "Multi selection";
				                newLabelVal = "multi";
				                break;
				   }
				}
				$(this).parents('.option_container').siblings('.label_selected').text(newLabel);
				$(this).parents('.option_container').siblings('.label_selected').attr('data-value', newLabelVal);
			});
			
			/* General event on click on ".option". It select the element clicked and unselect the others. 
				it closes the ".like_select". If it is a filter, it is possible to select more than one ".option" element. */
			$(".like_select .option_container .option").click(function(){
				if( (!$(this).hasClass('selected')) && (! $(this).parents('.like_select').hasClass('filter'))){
					var option_sel_value, option_sel_label;

					option_sel_value = $(this).attr('data-value');
					option_sel_label = $(this).text();
					$(this).parents('.like_select')
								.find('.label_selected')
									.attr('data-value', option_sel_value)
									.text(option_sel_label);
					
					/*if ($(this).parents('.option_container').parent().attr("class") === "main_tt_select"){
						newText = $(this).attr('title');
						$(this).parents('.option_container').prev().prev().text(cropLongTextLabel(newText, 12)).attr("data-value", newText).trigger('change'); // .label_selected
					}
					else{
						newText = $(this).text();
						// WTF: main_dd_select
						if ($(this).parents('.option_container').parent().attr("class") !== "main_pp_select"){
							$(this).parents('.option_container').prev().prev().text(newText).attr("data-value", newPage).trigger('change'); // .label_selected
						}
					}*/

					$(this)
						.addClass('selected')
						.siblings('.selected')
							.removeClass('selected');
					if ($(this).parents('.option_container').is(':visible')) {
						if($(this).parents('.option_container').hasClass('up')){
					       $(this).parents('.option_container').animate({
	    				       top: '-5px',
	    				       height:"toggle"
	    				   }, 400);
						} else {
						    $(this).parents('.option_container').animate({height:"toggle"}, 400);
						}
					}
				}
			});
			
			$('.like_select .option_container .option').hover(function(){
				var parent_title = $(this).parents('.like_select').attr('title');
					$(this).parents('.like_select').attr('data-title', parent_title);
					$(this).parents('.like_select').attr('title', '');
			}, function(){
				var old_parent_title = $(this).parents('.like_select').attr('data-title');
				$(this).parents('.like_select')
								.attr('title', old_parent_title)
								.removeAttr('data-title');
			});

			$('.like_select').each(function(){
				updateSelectLength(this);
			});
			
			$("#global_wrapper").on('mousedown', function (e) {
				if ( ($(e.target).closest(".like_select").length === 0) && !($(".option_container").is(':animated')) ) {
					if($('.option_container:visible').hasClass('up')){
				       $('.option_container:visible').animate({
    				       top: '-5px',
    				       height:"toggle"
    				   }, 400);
					} else {
					    $('.option_container:visible').animate({height:"toggle"}, 400);
					}
				}
			});

			/* CLICK SU THUMBNAILS */
			$(".thumb_single").click(function(){
				var tt_val, pp_val;
				var current_tt_val, current_tt_first_page;
				pp_val = $(this).attr('data-value');
				tt_val = $(this).attr('data-first-doc');
				
				current_tt_val = $(".main_tt_select .label_selected").attr("data-value"); 
				current_tt_first_page = $(".main_tt_select .option_container .option.selected").attr('data-first-page');
				
				if(current_tt_first_page === pp_val){
					updateHash(current_tt_val, pp_val, "");
				} else {
					updateHash(tt_val, pp_val, "");
				}

				if ( ! magnifierON ){
					$("#image_elem").show();
					$("#image_fade").show();
					
					if ($("#imgd_link").attr("class") === "current_mode"){
						$(".main_dd_select").trigger("imgd_thumb");
					}
					$(".thumb_link").trigger('click');
				}
			});	
			
			/* Fine Gestione eventi */


			/* HASH CHANGE - ba.bbq plugin */
				// IT: Associa un evento a windows.onhashchange; quando l'hash cambia, ottiene il suo valore per usarlo in diverse funzioni
				$(window).hashchange( function(){
					var hash_parts, newhash, current_doc, current_page, checkpp, checkdd, pp_lab, dd_lab;
					var dd_page, temp_search;


					hash_parts = new Array();
					hash_parts = location.hash.substr(1).split('&');
					if ( hash_parts != "" ) {
						for (var i = 0; i < hash_parts.length; i++) {
						    if(hash_parts[i].indexOf("page") === 0) { //begins with "page"
						        current_page = hash_parts[i].substr(5);
						    	if (current_page.indexOf('-') > 0) {
						    		current_page = current_page.substr(0, current_page.indexOf('-'));
						    	}
						    }
						    else if(hash_parts[i].indexOf("doc") === 0) { //begins with "filter"
						     	current_doc = hash_parts[i].substr(4);   
						    }
						}
					} else {
						current_page = $('.main_pp_select .option_container .option:first-child').attr('data-value');
						current_doc = $('.main_pp_select .option_container .option:first-child').attr('data-first-doc');
					}

					if ($("#regesto_cont").length > 0){ 
          				$('#regesto_cont').load("data/output_data/regesto/doc_"+current_doc+".html #regesto", function(){
          			    	if ( ($('#span_ee_select .label_selected').attr('data-value') != 'diplomatic') &&
          			    		 (!$('#switchReg').hasClass('active')) ){
          			    		$("#main_right_frame").find('.like_select.filter')
									.css('opacity', "1")
									.removeClass('not_active'); 	 	
          			    	} else {
          			    		$("#main_right_frame").find('.like_select.filter')
									.css('opacity', "0.5")
									.addClass('not_active'); 
          			    	}
          			    	if ( ($('#span_ee_select-add .label_selected').attr('data-value') != 'diplomatic') &&
          			    		 (!$('#switchReg-add').hasClass('active')) ){
          			    		$("#main_left_frame").find('.like_select.filter')
									.css('opacity', "1")
									.removeClass('not_active'); 	 	
          			    	} else {
          			    		$("#main_left_frame").find('.like_select.filter')
									.css('opacity', "0.5")
									.addClass('not_active'); 
          			    	}
          			    		
          				});
          			}

					//current_page = hash.replace( /^#/, '' );
					//var checkpp = $(xml).find('text pb:contains('+current_page+')').text();
					checkpp = $(xml).find('pages pb:contains('+current_page+')').text();
					
					pp_lab = $(xml).find('pages pb:contains('+current_page+')').attr("n") != "" ? $(xml).find('pages pb:contains('+current_page+')').attr("n") : $(xml).find('pages pb:contains('+current_page+')').text();

					dd_page = current_page.replace(/\./g, '\\.');

					temp_search = dd_page;
					
					checkdd = $(".main_dd_select").find(".option[data-value*="+temp_search+"]"); // .attr("id").substr(6)

					$(".main_left_arrow").removeClass("arrow_left_disable");
					$(".main_right_arrow").removeClass("arrow_right_disable");

					if((current_page === first_pp) || (current_page === first_dd)){
						$(".main_left_arrow").addClass("arrow_left_disable");
					}
					if((current_page === last_pp) || (current_page === last_dd)){
						$(".main_right_arrow").addClass("arrow_right_disable");
					}
					selectPP(current_page, pp_lab, current_doc);
					selectTT(current_doc);
					if( (checkpp !== "") && ($("#imgd_link").attr("class") !== "current_mode")){
						UnInitialize(); //Add by JK for ITL
						UnInitializeHS(); //Add by JK for HS
						$("#mag_image_elem").empty(); // Add by JK for Mag
						if($('#switchMag i').hasClass('fa-search-plus')){
						  magnifierON=true;
					    }
						gotopage(current_page, pp_lab, "none");

						if ( $('#span_tt_select .option_container .option:first-child').hasClass('selected') ) {
							$('#prev_doc, #prev_doc-add').addClass('disabled');
						} else if ($('#span_tt_select .option_container .option:last-child').hasClass('selected')){
							$('#next_doc, #next_doc-add').addClass('disabled');
						}
						//window.location.hash = "doc="+current_doc+"&page="+current_page;
						//chooseZoomMag(); // Add by JK for Mag				
					} else {
						// alert(!checkdd);
						$('#span_dd_select .label_selected').trigger('change');
						$("#mag_image_elem").empty(); // Add by JK for Mag
						if($('#switchMag i').hasClass('fa-search-plus')){
						  magnifierON=true;
						}
						/*if ($("#imgd_link").attr("class") !== "current_mode"){
							current_page = current_page.match('.*(?=-)');
							newhash = "doc="+current_doc;
							if(current_page != null){
								newhash += "&page="+current_page;
							} else {
								newhash += "&page="+$(".main_pp_select .label_selected").data("value");
							}
							//window.location.hash = newhash;
						}*/
					}
					
					if($('#txt_single').attr('class')==="current_mode"){ $('#header_collapse').css("left",'15px'); }
					// IT: Cambia il titolo della pagina in base all'hash
					//document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || 'blank' ) + '.';
				    
				});
				// IT: L'evento viene attivato quando cambia l'hash della pagina
				$(window).hashchange();
			/* / HASH CHANGE - ba.bbq plugin */
		}
	});

	

	/* Funzioni */
	//---
	
	// IT: Imposta l'etichetta dell'edizione, al primo caricamento della index
	//$('#edval span').text($("input[name=edition_r]:checked").val());	
	
	function updateHash(tt_val, pp_val, ee_val){
		window.location.hash = "doc="+tt_val+"&page="+pp_val;
	}

	/* Selezione pagina:
	   – aggiornamento della label del selettore delle pagine singole e selezione della option corrispondente
	   - aggiornamento della label del selettore delle pagine doppie e selezione della option corrispondente
	   - aggiunta della classe "inPage" alle option dei documenti contenuti nella pagina selezionata
	 */
	function selectPP(current_page, pp_lab, tt_val){
		var dd_opt, dd_val, dd_lab, dd_first_doc;
		
		$('#span_pp_select .label_selected')
			.attr('data-value', current_page)
			.attr('data-first-doc', tt_val)
			.text(pp_lab);

		$("#span_pp_select .option_container .option[data-value='"+current_page+"']")
			.addClass('selected')
				.siblings('.selected')
					.removeClass('selected');
		
		dd_opt = $('#span_dd_select .option_container .option:contains("'+pp_lab+'")');
		dd_opt
			.addClass('selected')
				.siblings('.selected')
					.removeClass('selected');
		dd_val = dd_opt.attr('data-value');
		dd_lab = dd_opt.text();
		dd_first_doc = tt_val;

		$('#span_dd_select .label_selected')
			.attr('data-value', dd_val)
			.attr('data-first-doc', dd_first_doc)
			.text(dd_lab);
		$('.inPage').removeClass('inPage');

		$("#span_tt_select .option[data-value='"+tt_val+"']").addClass('inPage');
		
		// #CDP. Add scroll to elemento
		
		$("#span_tt_select .option[data-first-page='"+current_page+"']").addClass('inPage');
		
		if ($('.inPage').length > 1) {
			var actual_label = $('.main_tt_select .label_selected').text();
			$('.main_tt_select .label_selected').text(actual_label + " *");
		} 
	}

	/* Selezione documento: 
	   - aggiornamento della label del selettore dei documenti
	*/
	function selectTT(current_doc){
		//alert(current_doc);
		$('#span_tt_select .label_selected')
			.attr('data-value', current_doc)
			.text(current_doc);
		
		var pp_first_doc_val = $("#span_pp_select .option_container .option.selected").attr('data-first-doc');	
		$("#span_tt_select .option[data-value='"+pp_first_doc_val+"']").addClass('inPage');
		
		$("#span_tt_select .option_container .option[data-value='"+current_doc+"']")
			.addClass('selected')
			.addClass('inPage')
				.siblings('.selected')
					.removeClass('selected');
		if ($('.inPage').length > 1) {
			var actual_label = $('.main_tt_select .label_selected').text();
			$('.main_tt_select .label_selected').text(actual_label + " *");
		}
	}

	/* Inizializzazione Popup (note inline, dettagli elementi liste, ...) */
	function InitializePopup(){
		//alert('pop');
        $('.popup').hover(function(e){
	        e.stopPropagation();
	        $(this).addClass('over');
	        if($(this).parents('.popup').length > 0){
	          $(this).parents('.popup').removeClass('over');
	        }
       	}, function(){
         	if($(this).parents('.popup').length > 0){
           		$(this).parents('.popup').addClass('over');
         	}
         	$(this).removeClass('over');
       	});
        
        $('.popup').click(function(e){
        	
        	//alert('click');
        	e.stopPropagation();

        	if ( $(this).find('> .tooltip').hasClass('opened') ) {
     			$(this).removeClass('opened');
     			$(this)
	     			.find('> .tooltip')
	     				.removeAttr('style')
	     				.removeClass('opened')
	     				.hide();
     		} else {
     			$('.tooltip.opened')
	        		.removeClass('opened')
	        		.toggle();
	        	$('.popup.opened')
	        		.removeClass('opened');
	         	
	         	if($(this).parent('.popup').find('> .tooltip')){
	           		$(this)
	           			.parent('.popup')
	           				.find('> .tooltip')
	           					.removeClass('opened')
	           					.toggle();
	     		}
     		 
     			$(this).addClass('opened');
     			$(this)
	     			.find('> .tooltip')
	     				.addClass('opened')
	     				.show();

	     		var x = e.clientX;
		    	var y = e.clientY;
	     		/*var tooltip_right = $(this).find('> .tooltip').offset().left + $(this).find('> .tooltip').width();
	     		var container_right = $('#central_wrapper').offset().left + $('#central_wrapper').width();
	     		var s = (container_right - tooltip_right);
	     		//alert(s);
	     		container_right += $('#text').position().left;
	     		if(s < $('#text').position().left){
	     			x = x - (container_right - tooltip_right);
	     		}*/
	     		if(x + 250 > $('#central_wrapper').width()){
	     			//x = ($('#central_wrapper').width() - $(this).find('> .tooltip').width() - $('#text').position().left);
	     			//alert( $(this).find('> .tooltip').width() );
	     			//alert( $('#text').position().left );
	     			$(this).find('> .tooltip').css({
	     				'margin-right': $('#text').position().left
	     			});
	     			x = x - ($('#text').position().left+10);
	     		}
	     		
	     		if ( y > $('#text_tool').offset().top-100 ){
	     			var p = $(window).height() - y + 15;
	     			$(this).find('> .tooltip').offset({ left: x-10 }).css('bottom', p+"px");
	     			var height_tooltip = $('.tooltip:visible').offset().top + $('.tooltip:visible').height()+6;
	     			$(this)
	     				.find('> .tooltip .before')
	     					.offset({
	     						top: height_tooltip
	     					})
	     					.css({
	     						'transform': 'rotate(180deg)'
	     					});
	     		} else {
	     			$(this).find('> .tooltip').offset({ left: x-10, top: y+20 });
	     		}

	     		$(this).find('> .tooltip .before').offset({ left: (e.clientX) });
	        	$(this).focus(); 	
	        	/*if ( $(this).find('> .tooltip').width() > 200 ){
     				$(this).find('> .tooltip').css('width', "250px");
     			}*/
	         	return false;
	        }
       	});

        $(document).click(function(){
		    $('.over').removeClass('over');
		    $('.opened').removeClass('opened');
        	$('.popup').find('> .tooltip').hide();
		    $(this).hide();
		});
       /* $('.popup').hover(function(e){
         e.stopPropagation();
         $(this).addClass('over');
         if($(this).parents('.popup').find('> .tooltip')){
           $(this).parents('.popup').removeClass('over');
           $(this).parents('.popup').find('> .tooltip').hide();
         }
         $(this).find('> .tooltip').show();
       }, function(){
         if($(this).parents('.popup').find('> .tooltip')){
           $(this).parents('.popup').addClass('over');
           $(this).parents('.popup').find('> .tooltip').show();
         }
         $(this).removeClass('over');
         $(this).find('> .tooltip').hide();
       });*/
    }

	// IT: Gestisce il cambio pagina e gli eventi correlati
	function gotopage(pp_val, pp_lab, state){
		var edition, edition_add; 
		//N.B. i caricamenti delle immagini si attivano grazie agli eventi change dei label_selected in iviewer_config
		edition = $("#span_ee_select .main_ee_select .label_selected").text().toLowerCase();
		$('#span_pp_select .label_selected').trigger('change');
		if (edition == "regesto") {
			edition = $("#span_ee_select .option_container .option:last-child").text().toLowerCase();
		}

		//alert(pp_val+"_"+edition);
		// $(".main_pp_select .option_container .option[data-value='"+pp_val+"']").trigger('click');
		$('#text_elem').empty().load("data/output_data/"+edition+"/page_"+pp_val+"_"+edition+".html #text_frame", function( response, status, xhr ){
			
			// Riattiva filtri attivi
			$('.like_select.filter').find('.option.selected').removeClass('selected').trigger('click');
			//IT: controlla se la pagine ha gli elementi necessari allo strumento ITL
			if ($('#text_elem .Area').length){
				if($('#switchITL').hasClass('inactive') || $('#switchITL').hasClass('likeInactive')){
					enableITLbutton();
				}
			} else {
				if($('#switchITL i ').hasClass('fa-circle-o')) disableITLbutton();
			     else $('#switchITL').addClass('likeInactive');
			}
			//IT: controlla se la pagine ha gli elementi necessari allo strumento HS
			if ($('#text_elem .Annotation').length){
				if($('#switchHS').hasClass('inactive') || $('#switchHS').hasClass('likeInactive')){
					enableHSbutton();
				}
			} else {
			     if($('#switchHS i ').hasClass('fa-circle-o')) disableHSbutton();
			     else $('#switchHS').addClass('likeInactive');
			}
			InitializePopup();
			var current_tt = $('#span_tt_select .option_container .option.selected').attr('data-value');
			$("#text_cont .doc[data-doc!='"+current_tt+"']").hide();

			$("img").error(function () {
			  	$(this)
				  	.unbind("error")
				  	.attr("src", "images/no-image.png")
				  	.css('opacity', '0.3');
				if ( $(this).parent('.tooltip') ){
					$(this).css({
						'width': '100px'
					});
				}
			});
		});
		
		$('#text_cont').animate({
			scrollTop: 0
		});
		if($('.current_mode').attr('id') === 'txttxt_link'){
			$('#text_cont-add').animate({ scrollTop: 0 });
		}
		
		/*$('#text_elem').load('pagina.html', function() {
			alert('Load was performed.');
		});*/
		
		// IT: Aggiorna l'indirizzo del frame secondario per il testo
		if ($("#text_cont-add").length > 0){ //SISTEMARE
			edition_add=$("#span_ee_select-add .option_container .option.selected").text().toLowerCase();

			$('#text_elem-add').load("data/output_data/"+edition_add+"/page_"+pp_val+"_"+edition_add+".html #text_frame");
				
			// IT: Aggiorna le informazioni all'interno dell'etichetta destra	
			$('#zvalopz')
				.text($("input[name=edition_r-add]:checked").val())
				.hide()
				.fadeIn(200);
		}
		
		// IT: Aggiorna le informazioni all'interno delle etichette			
		$('#central_page_number span').text(pp_val);
		/*$('#edval span')
			.hide()
			.fadeIn(200);*/

		//$("#iviewerImage").attr("src", "images/null.jpg"); // Loading...
		//$('#folio_page_number').val(pp_val).change(); // IT: Questo attiva l'evento nel file js/plugin/jquery.iviewer config
		
		// preload([
		// 	'images/single/'+$('.main_pp_select .option_container .option.selected').prev().text()+'.jpg',
		// 	'images/single/'+$('.main_pp_select .option_container .option.selected').next().text()+'.jpg'
		// ]);

		// IT: Se ci si trova nella modalit Thumb, chiude la schermata e visualizza l'immagine
		if($("#thumb_cont").css('display') === "block"){
			$(".thumb_link").trigger('click');
		}
	}
	// IT: Gestisce il cambio edizione nel frame testuale
	function gotoedition(pp_val, ee_val, pp_el, frame_id){
		var tt_val;
		tt_val = $('#span_tt_select .label_selected').attr('data-value');
		if (ITLon === true){
			UnInitialize(true);
		} //Add by JK for ITL
		if (HSon === true){
			UnInitializeHS(true);
		} //Add by JK for HS
		$('#'+pp_el).load("data/output_data/"+ee_val+"/page_"+pp_val+"_"+ee_val+".html #text_frame",
			function(status) {
				$('#'+frame_id+" .doc[data-doc!='"+tt_val+"']").hide();

				// IT: se il pulsante ITL è attivo e non sono in modalità txttxt, attiva ITL
				if ($("#switchITL i").hasClass('fa fa-chain')){
					if(!($('.current_mode').attr('id') === 'txttxt_link')){
						Initialize();
					}
				} /*Add by JK for ITL*/
				if ($("#switchHS i").hasClass('fa fa-dot-circle-o')){
					if(!($('.current_mode').attr('id') === 'txttxt_link')){
						InitializeHS();
					}
				} /*Add by JK for HS*/
				InitializePopup();
				
				if($("#"+pp_el).parents("div[id*='frame']").find('.like_select.filter')){
						$("#"+pp_el)
							.parents("div[id*='frame']")
								.find('.like_select.filter')
									.find('.option_container .option.selected')
										.removeClass('selected')
										.trigger('click');
										
					}
			}
		);

        var pp_el_upp = pp_el;
		pp_el_upp = pp_el_upp.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});

		// IT: Gestisce la scrittura nell'etichetta destra o sinistra a seconda del frame caricato
		/*if (frame_id.indexOf("-add")>-1) {
			$('#zvalopz').text(pp_el_upp);
		} else{
			$('#edval span').text(pp_el_upp);
		}*/
	}

	// IT: Un preload basilare per la navigazione delle immagini
	function preload(arrayOfImages) {
		$(arrayOfImages).each(function(){
			$('<img/>')[0].src = this;
		});
	}
    
    /* Navigazione per documento */
    function navDoc(toward){
        var current_tt, new_tt, current_pp, new_pp;
        current_tt = $('#span_tt_select').find('.option.selected');
        current_pp = $('#span_pp_select').find('.option.selected').attr('data-value');

        if (toward === "left") {
            new_tt = current_tt.prev();
        } else if (toward === "right"){
            new_tt = current_tt.next();
        }

		new_pp = new_tt.attr('data-first-page');
        new_tt.trigger('click');
        if (new_tt.prev().length <= 0) {
        	$('#prev_doc, #prev_doc-add').addClass('disabled');
        } else {
        	$('#prev_doc, #prev_doc-add').removeClass('disabled');
        }

        if (new_tt.next().length <= 0) {
        	$('#next_doc, #next_doc-add').addClass('disabled');
        } else {
        	$('#next_doc, #next_doc-add').removeClass('disabled');
        }
    }

    /* Apertura/chiusura regesto */
    function toggleReg(regesto_cont){
    	if ($(regesto_cont).is(":visible")) {
			$(regesto_cont).hide('drop',  {direction: 'up'}, 'linear', function(){
				var ee_val;
				ee_val = $(regesto_cont).parents("div[id*='frame']").find('.main_ee_select .label_selected').attr('data-value');
				if ( ee_val.toLowerCase() != 'diplomatic' ) {
					$(regesto_cont)
						.parents("div[id*='frame']")
							.find('.like_select.filter')
								.css('opacity', "1")
								.removeClass('not_active'); 
				}
			});
		} else {
			$(regesto_cont).show('drop',  {direction: 'up'}, 'linear', function(){
				// Disattivare filtri liste nell'edizione diplomatica
				$(regesto_cont)
					.parents("div[id*='frame']")
						.find('.like_select.filter')
							.css('opacity', "0.5")
							.addClass('not_active');
			});
		}
    }

    /* Navigazione per pagine */
	function arrow(toward){ //duplicata temporaneamente in jquery.rafmas-keydown
		var d_page, l_page;
		var current_pp, current_opt;
		var new_pp_opt;
		var new_pp_val, new_pp_lab, new_tt_val;
		var current_tt_val, current_tt_first_page;

		if ($("#imgd_link").attr("class") !== "current_mode"){
			current_opt = $('.main_pp_select .option_container .option.selected');
			current_pp = current_opt.attr("data-value")
			if (toward === "left" && ! $(current_opt).is(":first-child")){
				new_pp_opt = $('.main_pp_select .option_container .option.selected').prev();
			}
			if (toward === "right" && ! $(current_opt).is(":last-child")){
				new_pp_opt = $('.main_pp_select .option_container .option.selected').next();
			}
			new_tt_val = new_pp_opt.attr('data-first-doc'); // primo documento contenuto.
		} else {
			$('#span_dd_select .label_selected').attr('data-last-hash-txtimg', '');
			current_opt = $('.main_dd_select .option_container .option.selected');
			current_pp = current_opt.attr('data-value');
			if (toward === "left" && ! $(current_opt).is(":first-child")){
				new_pp_opt = $('.main_dd_select .option_container .option.selected').prev();
			}
			if (toward === "right" && ! $(current_opt).is(":last-child")){
				new_pp_opt = $('.main_dd_select .option_container .option.selected').next();
			}
			new_tt_val = new_pp_opt.attr('data-first-page-first-doc'); // primo documento contenuto.	
		}
					
		new_pp_val = new_pp_opt.attr('data-value'); // id pagina cliccata
		new_pp_lab = new_pp_opt.text(); 
		
		current_tt_val = $(".main_tt_select .label_selected").attr("data-value"); 
		current_tt_first_page = $(".main_tt_select .option_container .option.selected").attr('data-first-page');
		if(current_tt_first_page === new_pp_val){
			updateHash(current_tt_val, new_pp_val, "");
		} else {
			updateHash(new_tt_val, new_pp_val, "");
		}
	}

	// Simulazione trigger di un evento "click" su option per gestire gli scambi dei livelli di edizione
	function selectOther(other_to_select, other_ee_select, page, doc, other_frame){
		gotoedition(page, doc, other_to_select.attr('data-value').toLowerCase(), other_frame);
    	other_to_select.addClass('selected')
    						.siblings('.option').removeClass('selected');
    	other_ee_select.find('.label_selected')
    						.attr('data-value', other_to_select.attr('data-value').toLowerCase())
    						.text(other_to_select.text());
	}

	// Gestione lunghezza delle select sulla base della option più lunga
	function updateSelectLength(elem){
		var widthSel, widthOpt;
		// Calcolo la larghezza del div figlio di .like_select
		widthSel = $(elem).find('div').width();
		// Calcolo la larghezza del div.option_container, aggiungendo 10 per via del padding 
		widthOpt = $(elem).find('.option_container').width()+10;
		// Se la larghezza del contenitore esterno è maggiore di quella delle option aggiorno l'option_container e ristemo il genitore	
		if(widthSel > widthOpt){
			
			// Imposto la larghezza dell'option container secondo quella del div figlio di .like_select
			$(elem).find('.option_container').css('width', widthSel);

			// Ricalcolo la dimensione dell'option_container, sempre aggiungendo 10 per il padding
			widthOpt = $(elem).find('.option_container').width()+10;
			// Se la nuova dimensione di option_container è maggiore di quella del div figlio di .like_select
			// (Ovvero se le opzioni "sbordano")
			// Aggiorno nuovamente la larghezza del div .like_select sulla base della nuova larghezza di option_container
			if(widthSel < widthOpt){
				$(elem).css('width', widthOpt);
			}
		}
		// Se altrimenti il contenitore delle option è più largo in partenza aggiorno il genitore
		else {
			
			// imposto la larghezza di .like_select sulla base di quella di option_container, 
			// aggiungendo 14 per via del div per l'apertura
			$(elem).css('width', widthOpt+14);
			// Poi aggiorno la dimensione dell'option_container, aggiungendo i 4px che mi permettono di allinearla al div figlio di .like_select
			$(elem).find('.option_container').css('width', widthOpt+4);
		}
		// Riporto la position di option_container ad absolute per rendere corretto il posizionamento all'apertura
		$(elem).find('.option_container').css("position", "absolute");
		$(elem).find('.option_container').css("visibility", "visible");
		$(elem).find('.option_container').css("display", "none");

		if ( $(elem).find('.option_container').hasClass('up') ) {
			var height;
			height = $(elem).find('.option_container').height()+6;
			$(elem).find('.option_container').attr('data-toggle-top', height);
		}

		if(elem.id === 'span_ee_select'){
			var widthEE, optEE;
			widthEE = $('#span_ee_select').find('div').width();
			optEE = $('#span_ee_select').find('.option_container').width();
			$('#span_ee_select-add').find('.option_container').removeAttr('style');
			$('#span_ee_select-add').css('width', widthEE);
			$('#span_ee_select-add').find('.option_container').css('width', optEE);
			$('#span_ee_select-add').addClass('widthChanged');
		}
		if(elem.id === 'span_dd_select'){
			var widthPP, optPP;
			widthPP = $('#span_pp_select').find('div').width() * 2 - 28;
			optPP = $('#span_pp_select').find('.option_container').width() * 2 - 18;
			$('#span_dd_select').find('.option_container').removeAttr('style');
			$('#span_dd_select').css('width', widthPP);
			$('#span_dd_select').find('.option_container').css('width', optPP);
			$('#span_dd_select').addClass('widthChanged');
		}
		if(elem.id === 'span_list_select-add'){
			var widthEE, optEE;
			widthEE = $('#span_list_select-add').find('div').width();
			optEE = $('#span_list_select-add').find('.option_container').width();
			$('#span_list_select-add').find('.option_container').removeAttr('style');
			$('#span_list_select-add').css('width', widthEE);
			$('#span_list_select-add').find('.option_container').css('width', optEE);
			$('span_list_select-add').addClass('widthChanged');
		}
		if ( $(elem).find('.option_tooltip').length > 0 ){
			$(elem).find('.option_tooltip').css('left', widthOpt+16);
		}
	}

	function goFullScreenLeft(){
		var height_full, width_full,
			margin_left, margin_top,
			widthSel, widthOpt,
			left_headerHeight;

		//Se ITL è attivo, disattivalo. Disabilita il pulsante.
		if(ITLon){
			UnInitialize();
		}
		disableITLbutton();

		$('.zoomWindow').hide();
        $('.zoomPup').hide();
		if($('#header_collapse').hasClass('fa-caret-down')){
			$("#header_collapse").trigger('click');
		}
		$('#header_collapse').toggle();
		$("#main_left_frame").toggleClass("full");
		height_full = ($(window).height() > $("body").height()) ? $(window).height()-4 : $("body").height();
		width_full = ($(window).width()>$("#global_wrapper").width()) ? $(window).width()-4 : $("#global_wrapper").width()-4;
		// 4 è l'altezza totale dei bordi di sinistra e destra
		margin_left = -($('#main_left_frame').offset().left);
		margin_top = -($('#main_left_frame').offset().top);
		
		//cambia dimensione elementi per Mag //Add for Mag
		left_headerHeight = $('#left_header').height();
        $('#mag_image_elem').css({'margin-top': left_headerHeight+'px', 'height': height_full-left_headerHeight+'px'});
        $('.zoomWindow').css({left: (width_full - $(".zoomWindow").width())/2+'px'});
        $('.zoomPup').css({left: (width_full - $(".zoomPup").width())/2+'px'});
        
		$('#main_left_frame').animate({
			width: width_full,
			height: height_full,
			top: margin_top,
			left: margin_left,
			minWidth: "1021px"
		}, 700, function(){
			$('#left_header .closeFullScreen').toggle();
			$('.zoomWindow').show(0); //Add for mag
			//$('#header_collapse').animate({opacity: 1});
			fitFrame();
		});
		$('.go-full-left').toggle();
		//$('#switchITL:visible').hide();
		$('#switchITL').addClass('inactive');
		
		if(($('#span_ee_select-add').is('visible'))&&!$('#span_ee_select-add').hasClass('widthChanged')){
			$('#span_ee_select-add').addClass('widthChanged');
			$('#span_ee_select-add .option_container').removeAttr('style');

			$('#span_ee_select-add').each(function(){
				widthSel = $(this).width();
				widthOpt = $(this).find('.option_container').width()+10;
				if(widthSel > (widthOpt+24)){
					$(this).find('.option_container').css('width', widthSel-10);
					//alert("widthSel"); 
				} else {
					$(this).css('width', widthOpt+24);
					$(this).find('.option_container').css('width', widthOpt+14);
					//alert("widthOpt");
				}
			});
		}

	}

	function closeFullScreenLeft(){
		//$('#header_collapse').animate({opacity: 0});
		$("#main_left_frame").toggleClass("full");
		$('.zoomWindow').hide();
		$('.zoomPup').hide();
		//caso in cui si passa a fullscreen dalla visualizzazione a doppia pagina
		if($('#main_right_frame').css("display") === "none"){
			$('#main_left_frame').animate({
				width: "99.5%",
				height: "100%",
				top: "0px",
				left: "0px",
				minWidth: "0px"
			}, 700, function(){
				$('#left_header .closeFullScreen').toggle();
				$('.go-full-left').toggle();
				//$('#header_collapse').removeAttr('style');
				$('#header_collapse').toggle();
				//Add for Mag
				setMagHeight();
				$('.zoomWindow').show();
				fitFrame();
			});
		} else {
			$('#main_left_frame').animate({
				width: "49.8%",
				height: "100%",
				top: "0px",
				left: "0px",
				minWidth: "0px"
			}, 700, function(){
				$('#left_header .closeFullScreen').toggle();
				$('.go-full-left').toggle();
				//$('#header_collapse').removeAttr('style');
				$('#header_collapse').toggle();
				//Add for Mag
				setMagHeight();
				$('.zoomWindow').show();
				checkAnnPosHS(); //Add for HS
				fitFrame();
			});
			$('#switchITL').show();
			//Se ITL è impostato su attivo, attiva il collegamento. Abilita il pulsante.
			if ($('#switchITL i ').hasClass('fa fa-chain')){ //Add by JK for ITL
				Initialize();
			}
			enableITLbutton();
		}

		//$('#span_dd_select').hide();
	}

	function goFullScreenRight(){
		var height_full, width_full, margin_right, margin_left, margin_top;

		if (ITLon){ //Add by JK for ITL
			UnInitialize();
		}
		if (HSon){ //Add by JK for HS
			UnInitialize();
		}
		if($('#header_collapse').hasClass('fa-caret-down')){
			$("#header_collapse").trigger('click');
		}
		$('#header_collapse').toggle();
		
		// Aggiunta di suffisso nel caso di testo a unico frame
		var suffix="";
		if($('#main_right_frame-single').length>0)    suffix='-single';

		// Gestione del full screen per browser webkit
		if ($.browser.webkit) {
			height_full = ($(window).height() > $("body").height()) ? $(window).height()-4 : $("body").height();
			width_full = ($(window).width()>$("#global_wrapper").width()) ? $(window).width()-4 : $("#global_wrapper").width()-4;
			// 4 è l'altezza totale dei bordi di sinistra e destra
			margin_right = -($(window).width()-($('#main_right_frame'+suffix).offset().left+$('#main_right_frame'+suffix).width())-4);
			margin_top = -($('#main_right_frame'+suffix).offset().top);
			$("#main_right_frame"+suffix).toggleClass("full");
			$('#main_right_frame'+suffix).animate({
				width: width_full,
				height: height_full,
				marginTop: margin_top,
				right:margin_right,
				minWidth: "1021px"
			}, 700, function(){
				fitFrame();
				$('#right_header .closeFullScreen').toggle();
			});
			$("#main_right_frame"+suffix).css('position', 'absolute');
			$('.go-full-right').toggle();
			
		} else {
			height_full = ($(window).height() > $("body").height()) ? $(window).height()-4 : $("body").height();
			width_full = ($(window).width()>$("#global_wrapper").width()) ? $(window).width()-4 : $("#global_wrapper").width()-4;
			// 4 è l'altezza totale dei bordi di sinistra e destra
			margin_right = -($(window).width()-($('#main_right_frame'+suffix).offset().left+$('#main_right_frame'+suffix).width())-4);
			margin_top = -($('#main_right_frame'+suffix).offset().top);
			margin_left = -($('#main_right_frame'+suffix).offset().left);
			$("#main_right_frame"+suffix).toggleClass("full");

			$('#main_right_frame'+suffix).animate({
				width: width_full,
				height: height_full,
				marginTop: margin_top,
				left: margin_left,
				right:margin_right,
				minWidth: "1021px"
			}, 700, function(){
				fitFrame();
				$('#right_header .closeFullScreen').toggle();
			});
			
			$('.go-full-right').toggle();
		}

	}

	function closeFullScreenRight(){
		var widthLeft;

		if ($('#switchITL i ').hasClass('fa fa-chain')){ //Add by JK for ITL
			Initialize();
		}
		if ($('#switchHS i ').hasClass('fa fa-dot-circle-o')){ //Add by JK for HS
			InitializeHS();
		}
		
		// Aggiunta di suffisso nel caso di testo a unico frame
		var suffix="";
		if($('#main_right_frame-single').length>0)    suffix='-single';
		
		// Gestione del full screen per browser webkit
		if ($.browser.webkit) {
			if($('#main_right_frame-single').length>0)
			     widthLeft = $('#central_wrapper').width();
			else 
			     widthLeft = $('#main_left_frame').width()-4;
			$('#main_right_frame'+suffix).animate({
				width: widthLeft,
				height: "100%",
				marginTop: "0px",
				right: "0px",
				minWidth: "0px"
			}, 700, function(){
				fitFrame();
				$('#main_right_frame'+suffix).removeAttr("style");
				$('#right_header .closeFullScreen, #header_collapse').toggle();
				$('#main_right_frame'+suffix).toggleClass("full");
				$('.go-full-right').toggle();
			});
		} else {
			if($('#main_right_frame-single').length>0)
			     widthLeft = $('#central_wrapper').width();
			else
			     widthLeft = $('#main_left_frame'+suffix).width()-3;
			$('#main_right_frame'+suffix).animate({
				width: widthLeft,
				height: "100%",
				marginTop: "0px",
				left: "0px",
				minWidth: "0px"
			}, 700, function(){
				fitFrame();
				$('#main_right_frame'+suffix).removeAttr("style");
				$('#right_header .closeFullScreen,  #header_collapse').toggle();
				$('#main_right_frame'+suffix).toggleClass("full");
				$('.go-full-right').toggle();
			});
		}

	}

	function fitFrame(){
		var noMenu_height;
		noMenu_height = $('#image_cont').height();
		if($('#left_header').hasClass('menuClosed')){
			$('#text_cont, #regesto_cont, #text_cont-add, #regesto_cont-add, #thumb_cont')
				.css('height', noMenu_height);
		} else {
			noMenu_height -=84;
			$('#text_cont, #regesto_cont, #text_cont-add, #regesto_cont-add, #thumb_cont')
				.css('height', noMenu_height)
		}
	}

	function cropLongTextLabel(text_label, min_char_num){
		if(text_label.length>min_char_num){
			text_label = text_label.substr(0, min_char_num-3)+"...";
		}
		return text_label;
	}

	/* / Funzioni */
	
	
	/* Gestione click */
	$("#home_title").click(function(){
		window.location="index.html";
	});

	$(".main_left_arrow").click(function(){
		arrow("left");
	});
	$(".main_right_arrow").click(function(){
		arrow("right");
	});
	
	$("#prev_doc, #prev_doc-add").click(function(){
	    navDoc("left");
	});
	$("#next_doc, #next_doc-add").click(function(){
	    navDoc("right");
	});
	
	$("#main_left_menu").click(function(){
		if($("#main_left_menu-openlink").css('display') !== "none"){
			$("#main_left_frame header").show('slide', {direction: 'left'}, 1000);
			$("#main_left_frame-single header").show('slide', {direction: 'left'}, 1000);
			$("#main_left_menu-openlink").toggle();
			$("#main_left_menu-closelink").toggle();
			keycount = 1;
		} else{
			$("#main_left_frame header").hide('slide', {direction: 'left'}, 1000);
			$("#main_left_frame-single header").hide('slide', {direction: 'left'}, 1000);
			$("#main_left_menu-openlink").toggle();
			$("#main_left_menu-closelink").toggle();
			keycount = 0;
		}
	});
			
	$("#main_right_menu").click(function(){
		if($("#main_right_menu-openlink").css('display') !== "none"){
			$("#main_right_frame header").show('slide', {direction: 'right'}, 1000);
			$("#main_right_menu-openlink").toggle();
			$("#main_right_menu-closelink").toggle();
			keycount = 0;
		} else{
			$("#main_right_frame header").hide('slide', {direction: 'right'}, 1000);
			$("#main_right_menu-openlink").toggle();
			$("#main_right_menu-closelink").toggle();
			keycount = 1;
		}
	});

	$(".thumb_link").click(function(){
		if (magnifierON == false){  //modalità zoom attivo JK
            if($("#image_loading").css('display')!=="none"){$("#image_loading").hide()}
            if($("#image_elem").css('display') === "none"){
				$("#image_elem").show();
				$("#image_fade").show();
				if(!$('#left_header').hasClass('menuClosed')){
					$("#image_tool").show();
				}
				$("#thumb_cont").hide();
			} else{
				$("#image_elem").hide();
				$("#image_fade").hide();
				$("#image_tool").hide();
				$("#thumb_cont").show();
			}
		}else {                  //modalità magnifier attivo JK
			if($("#mag_image_elem").css('display') === "none"){
				$("#mag_image_elem").show();
				$("#image_tool").show();
				$("#thumb_cont").hide();
			} else{
				$("#mag_image_elem").hide();
				$("#image_tool").hide();
				$("#thumb_cont").show();
			}
		}
	});
	
	/* APRI/CHIUDI REGESTO */
	$('.toggleReg').click(function(event) {
		var regesto_cont;
		$(this)
			.toggleClass('active')
			.find('.fa')
				.toggleClass('fa-toggle-on')
				.toggleClass('fa-toggle-off');
		if ( $(this).attr('id') == "switchReg-add" ) {
			regesto_cont = "#regesto_cont-add";
		} else {
			regesto_cont = "#regesto_cont";
		}
		toggleReg(regesto_cont);

	});

	// MODE -
	$("#txtimg_link").click(function(){
		if($(this).attr("class") !== "current_mode"){
			
			if ( $("#span_dd_select .label_selected").attr('data-last-hash-txtimg') != "" ) {
				var hash_parts, temp_pp, temp_tt; 
				hash_parts = new Array();
				hash_parts = $("#span_dd_select .label_selected").attr('data-last-hash-txtimg').split('&');
				if ( hash_parts != "" ) {
					for (var i = 0; i < hash_parts.length; i++) {
					    if(hash_parts[i].indexOf("page") === 0) {
					        temp_pp = hash_parts[i].substr(5);
					    }
					    else if(hash_parts[i].indexOf("doc") === 0) {
					     	temp_tt = hash_parts[i].substr(4);   
					    }
					}
				}
				updateHash(temp_tt, temp_pp);
			} else {
				updateHash($('#span_tt_select .label_selected').attr('data-value'), 
					   $('#span_pp_select .label_selected').attr('data-value'), "");
			}

			$("#txtimg_link")
				.addClass("current_mode")
				.siblings()
					.removeClass("current_mode");
			if ( $('#span_ee_select .label_selected').attr('data-value')!='diplomatic' ) {
				$('.like_select.filter').removeClass('not_active');
			}
			
			$("#text_cont-add").remove();
			if($("#regesto_cont-add"))
				$("#regesto_cont-add").remove();
			$("#span_ee_select-add").hide();
			if($("#switchReg-add"))
				$("#switchReg-add").hide();

			$("#span_dd_select").hide();
			
			$('#span_pp_select').show();
			$('#span_pp_select').css("top", "-7px"); // #CDP. Rimuovere e gestire con css

			$("#main_right_frame").show();
			$("#main_left_frame").animate({
				'width': '49.8%'
			}, function(){
				$("#right_menu").show();
				$("#text_cont").show();
			});

			$("#mag").show();
			$("#image_menu").show();
			$('#switchITL').show();
			$('#switchHS').show();
			$("#image_cont").show();

			$('#prev_doc-add, #next_doc-add, #text_tool-add').hide();
			if($('#prev_doc')){
				$('#prev_doc').show();
			}

			if($('#right_header').hasClass('menuClosed')){
				$('#right_header').hide();
			}
			
			$('#thumb_elem').show();
			$('#zvalint').show();
			//$('#zvalopz').text("");

			fitFrame();
			
			$('#header_collapse').animate({
     			left: "50%",
     			marginLeft: "-10px"
     		});
     
     		if(! $('.go-full-right').is(':visible')){
     			$('.go-full-right').show();
     		}
     		if ($("#switchITL i").hasClass('fa fa-chain')){
     			if(!$("#switchITL").hasClass('inactive')){
     				Initialize();
     			}
             }/*Add by JK for ITL*/
     		if ($("#switchHS i").hasClass('fa fa-dot-circle-o')){
                 if(!$("#switchHS").hasClass('inactive')){
     				InitializeHS();
                 }
             }/*Add by JK for HS*/
             
             if($('.go-full-left').hasClass('onWhite')){
     			$('.go-full-left').removeClass('onWhite');
             }
		}
	});
	/*$("#imgimg_link").click(function(){
		if($(this).attr("class")!="current_mode"){
			$("#imgimg_link").addClass("current_mode");
			$("#txttxt_link").removeClass("current_mode");			
			$("#txtimg_link").removeClass("current_mode");	

			$("#text_menu").hide();
			$("#text_cont").hide();
			
			$("#image_menu").show();
			$("#image_cont").show();
			
			
			$('#image_cont')
				.clone()
				.attr("id", "image_cont-add")
				.insertAfter("#left_header")
			;
							
		}
	});*/
	$("#txttxt_link").click(function(){
		var main_text_edition, first_new_edition, second_new_edition, noMenu_height;

		if($(this).attr("class") !== "current_mode"){
			UnInitialize();//Add by JK for ITL
			UnInitializeHS();//Add by JK for HS
			
			updateHash($('#span_pp_select .label_selected').attr('data-first-doc'), $('#span_pp_select .label_selected').attr('data-value'), "");
			
			$("#txttxt_link").addClass("current_mode").siblings().removeClass("current_mode");
			//$("#imgd_link").removeClass("current_mode");
			//$("#txtimg_link").removeClass("current_mode");
			//$("#imgimg_link").removeClass("current_mode");

			$("#image_menu").hide();
			$("#mag").hide();
			$("#image_cont").hide();
			$("#span_dd_select").hide();

			$('#prev_doc-add, #next_doc-add').show();
			$('#span_pp_select').show();
			if ( !$('#text_tool').hasClass('menuClosed') ) { 
				$('#text_tool-add').show();
			}
			$('#span_pp_select').css("top", "0px"); // #CDP. Rimuovere e gestire con css

			$("#main_right_frame").show();
			if($('#right_header').hasClass('menuClosed')){
				$('#right_header').hide();
			}
 			$("#main_left_frame").animate({
				width: '49.8%',
				borderLeftWidth: '2px',
				borderRightWidth: '2px'
			}, function(){
				$("#right_menu").show();
				$("#text_cont").show();
			});

			$('#text_cont')
				.clone()
				.attr("id", "text_cont-add")
				.insertAfter("#left_header")
			;
			$('#text_cont-add>#text_elem')
				.attr("id", "text_elem-add")
			;

			if ($('#prev_doc')) {
				$('#prev_doc, #next_doc-add').hide()
			}
			if($('#regesto_cont').length > 0 ) {
				$('#regesto_cont')
					.clone()
					.attr("id", "regesto_cont-add")
					.insertAfter("#left_header")
				;
				$('#regesto_cont-add>#regesto')
					.attr("id", "regesto-add")
				;
				if ( ! $('#switchReg-add').hasClass('active') ) {
					$('#regesto_cont-add').hide();
				} else {
					$('#regesto_cont-add').show();
				}
			}

			//$('#zvalint').hide(); //SISTEMARE
			//$('#zvalopz').text($("input[name=edition_r]:checked").val());			
			$('#span_ee_select-add').css({display: "inline-block"});
			$('#switchReg-add').css({display: "inline-block"});
			//$("#span_ee_select-add").show();

			$('#span_ee_select-add .option_container .option:nth-child(2)').trigger('click');

			fitFrame();
			
			if(!$('#left_header').hasClass('menuClosed')){
				if(!$('#span_ee_select-add').hasClass('widthChanged')){
	    			$('#span_ee_select-add').addClass('widthChanged');
	    			$('#span_ee_select-add .option_container').removeAttr('style');
	    
	    			updateSelectLength($('#span_ee_select-add'));
	    		}
			}

    		if(!$('#text_tool-add').hasClass('menuClosed')){
	    		if(!$('#span_list_select-add').hasClass('widthChanged')){
	    			$('#span_list_select-add').addClass('widthChanged');
	    			$('#span_list_select-add .option_container').removeAttr('style');
	    
	    			updateSelectLength($('#span_list_select-add'));
	    		}
	    	}

    		$('#header_collapse').animate({
    			left: "50%",
    			marginLeft: "-10px"
    		});
    		if(! $('.go-full-right').is(':visible')){
    			$('.go-full-right').show();
    		}
    		if($('#left_header').hasClass('menuClosed')){
    			noMenu_height = $('#image_cont').height();
    			$('#text_cont-add').css({
    				"top": "-42px",
    				"height": noMenu_height
    			});
    			$('#text_cont').css({
    				"height": noMenu_height
    			});
    			$('.go-full-left').addClass('onWhite');
    		}
    		//InitializePopup();
		}
	});

	$("#imgd_link").click(function(){
		if($(this).attr("class") !== "current_mode"){
			UnInitialize(); //Add by JK for ITL
			UnInitializeHS(); //Add by JK for HS
			
			$("#imgd_link").addClass("current_mode").siblings().removeClass("current_mode");
			//$("#txtimg_link").removeClass("current_mode");
			//$("#imgimg_link").removeClass("current_mode");
			//$("#txttxt_link").removeClass("current_mode");

			//alert($(".main_pp_select .label_selected").text());
			$(".main_dd_select").trigger("imgd_mode");
			$('#span_pp_select').hide();
			$("#switchReg-add, #text_tool-add, #regesto_cont-add").hide();
			
			$("#right_menu").hide();
			$("#main_left_frame").animate({
				'width': '99.5%'
			} //, 800
			, function(){
				$("#main_right_frame").hide();
			});

			//$("#image_cont-add").remove();
			$("#text_cont-add").remove();
			$("#span_ee_select-add").hide();

			//$("#text_cont").hide();

			$("#mag").show();
			$("#image_menu").show();
			$("#image_cont").show();
			$('#span_dd_select').css({display: "inline-block"});
			$('#switchITL').hide();
			$('#switchHS').hide();
			//$('#thumb_elem').hide();

			fitFrame();
			
			if(!$('#left_header').hasClass('menuClosed')){
				if(!$('#span_dd_select').hasClass('widthChanged')){
	    			$('#span_dd_select').addClass('widthChanged');
	    			$('#span_dd_select .option_container').removeAttr('style');
	    			updateSelectLength($('#span_dd_select'));
	    		}
			}
			
    		$('#header_collapse').animate({
    			left: "100%",
    			marginLeft: "-30px"
    		});
    		$('.go-full-right').hide();
    		if($('.go-full-left').hasClass('onWhite')){
    			$('.go-full-left').removeClass('onWhite');
            }
		}
	});
	
	$("#txt_single").click(function(){
	    if($(this).attr("class") !== "current_mode"){
	       $("#txt_single").addClass("current_mode").siblings().removeClass("current_mode");
	       $('#main_left_frame').animate({
	           width: '0px',
	           borderLeftWidth: '0px',
	           borderRightWidth: '0px'
	       }, function(){
	          $("#text_cont-add").remove(); 
	       });
	       $('#header_collapse').animate({
	          left: '15px' 
	       });
	    }
	});
	// /MODE -

	$("#header_collapse").click(function(){
		var noMenu_height, withMenu_height;
		if (magnifierON === false){
			$('#image_tool').slideToggle().toggleClass('menuClosed');
		} else {
			$('#image_tool').toggleClass('menuClosed');
		}
		// Modifico colore dell'icona .go-full-right che altrimenti non si vedrebbe
		$('.go-full-right').toggleClass('onWhite');
		
		// Gestione menu sinistro: chiudo/apro + aggiungo/tolgo la classe menuClosed
		$('#left_header').toggle('blind').toggleClass('menuClosed');
		
		// Se è aperto il text di sinistra modifico colore dell'icona go-full-left che altrimenti non si vedrebbe
		if($('#text_cont-add').css('display') === 'block'){
			$('.go-full-left').toggleClass('onWhite');
			$('#text_tool-add').slideToggle().toggleClass('menuClosed');
		}
		setMagHeight(); //Add for Mag
		// se ho appena chiuso il menu di sinistra
		if($('#left_header').hasClass('menuClosed')){
			// Modifico le dimensioni del testo di sinistra per riempire il box
			noMenu_height = $('#image_cont').height();
			$('#text_cont-add, #regesto_cont-add, #regesto_cont, #thumb_cont').animate({
				top: "-42px",
				height: noMenu_height
			});
		} else {
			withMenu_height = noMenu_height - 84;
			// altrimenti (se ho appena aperto il menu sx)
			// Risistemo il box del testo a sinistra
			$('#text_cont-add, #regesto_cont-add, #regesto_cont, #thumb_cont').animate({
				top: "0px",
				height: withMenu_height
			});
		}

		// Gestione menu destro: chiudo/apro + aggiungo/tolgo la classe menuClosed
		$('#right_header').toggle('blind').toggleClass('menuClosed');
		$('#text_tool').slideToggle().toggleClass('menuClosed');
		noMenu_height = $('#image_cont').height();
		// Se ho appena chiuso il menu di destra
		if($('#right_header').hasClass('menuClosed')){
			
			if($('#text_tool').length>0){
			    $('#text_cont, #text_cont-add, #regesto_cont, #regesto_cont-add, #thumb_cont').animate({
			    	//marginTop: "-42px",
			    	height: noMenu_height	
		    	});
			} else {
			    $('#text_cont, #text_cont-add, #regesto_cont, #regesto_cont-add, #thumb_cont').animate({
			     	//marginTop: "-42px",
					height: noMenu_height
			    });
           	} 
		} else {
			withMenu_height = noMenu_height - 84;
			$('#text_cont, #text_cont-add, #regesto_cont, #regesto_cont-add').animate({
				//marginTop: "42px",
				height: withMenu_height
			});
		}

		// Modifico lo stile e la posizione dell'icona
		if($('#header_collapse').hasClass('fa-caret-up')){
			if($(".closeFullScreen:visible").length>0){
				$('#header_collapse').animate({
					top: "-75px"
				});
			} else {
				$('#header_collapse').animate({
					top: "-8px"
				});
			}
			$('#header_collapse').removeClass('fa-caret-up').addClass('fa-caret-down');
		} else {
			if($(".closeFullScreen:visible").length>0){
				$('#header_collapse').animate({
					top: "-39px"
				});
			} else {
				$('#header_collapse').animate({
					top: "23px"
				});
			}
			$('#header_collapse').removeClass('fa-caret-down').addClass('fa-caret-up');
		}
		
		$('.like_select:visible').each(function(){
										if(!$(this).hasClass('widthChanged')){
											$(this).addClass('widthChanged');
											$(this).find('.option_container').removeAttr('style');
											updateSelectLength($(this));
										}
		});
	});
	
	$("#goFullScreenLeft").click(function(){
		goFullScreenLeft();
	});
	$("#goFullScreenRight").click(function(){
		goFullScreenRight();
	});
	$("#closeFullScreenLeft").click(function(){
		closeFullScreenLeft();
	});
	$("#closeFullScreenRight").click(function(){
		closeFullScreenRight();
	});
	$("#search_link").click(function(){
		alert("Coming soon during 2014");
	});
	/* / Gestione click */
	
	/*$("#text_copy").live("click", function(){
		..codice qui..
	});*/

	$(window).bind('resize', function(e){
		var height_full, width_full, leftCss, newLeft, rightR, leftR;
		window.resizeEvt;
		if($('.full')){
			height_full = ($(window).height()>$("body").height()) ? $(window).height()-4 : $("body").height();
			width_full = $(window).width()-4;
			$('.full').css({
				"height": height_full,
				"width": width_full
			});
			setMagHeight();
			$(window).resize(function(){
				clearTimeout(window.resizeEvt);
				fitFrame();
				window.resizeEvt = setTimeout(function()
				{
					leftCss = $('.full').css("left").replace(/[^-\d\.]/g, '');
					newLeft = leftCss - ($('.full').offset().left);
					$('.full').css("left", newLeft);

					if($('#main_right_frame').hasClass('full')){
						rightR = -(($('.go-full-right').offset().left)-($('.go-full-right').position().left));
						$('.go-full-right').css("right", rightR);
					}
					else{
						if($('#main_left_frame').hasClass('full')){
							leftR = -(($('.go-full-left').offset().left)-($('.go-full-left').position().left));
							$('.go-full-left').css("left", leftR);
						}
					}
				}, 300);
			});
		}
	});

});
