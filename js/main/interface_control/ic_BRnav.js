/**
 * Interface Control jQuery
 * Functions Handling Global Navigation Bar Bindings
 * Version 0.3 (201601)
 *
 * Copyright (C) 2013-2017 the EVT Development Team.
 *
 * EVT 1 is free software: you can redistribute it
 * and/or modify it under the terms of the
 * GNU General Public License version 2
 * available in the LICENSE file (or see <http://www.gnu.org/licenses/>).
 *
 * EVT 1 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * @short-term Greta Musu - GM
 * (added functions for global navigation bar and support for Viscoll)
 * @in 2017/18
 *
 **/

// Funzione al click su ImgTxt
function createSliderTxtImg() {
	var arrayPages = []; // Array che conterrà il numero delle pagine
	if ($('.main_pp_select')) {
		$('.main_pp_select .option_container .optionGroup div').each(function() {
			var pageId = $(this).attr('data-value');
			var pageLabel = $(this).text();
			var docId = $(this).attr('data-first-doc');
			arrayPages.push({
				id: pageId,
				label: pageLabel,
				firstDoc: docId
			}); // Lo mette nell'array
		});
		createBrnav(arrayPages); // Restituisce l'array contenente le pagine
	}
}

// TODO: create function fo click on TxtTxt
function createSliderTxtTxt() {
	var arrayTexts = [];
	if ($('.main_pp_select')) {
		$('.main_pp_select .option_container .optionGroup div').each(function() {
			var pageId = $(this).attr('data-value');
			var pageLabel = $(this).text();
			var docId = $(this).attr('data-first-doc');
			arrayTexts.push({
				id: pageId,
				label: pageLabel,
				firstDoc: docId
			}); // Lo mette nell'array
		});
		createBrnav(arrayTexts); // Restituisce l'array contenente le pagine
	}
}

// Funzione al click su Bookreader
function createSliderBookreader() {
	var arrayPagePairs = [];
	if ($('.main_dd_select')) {
		$('.main_dd_select .option_container .option').each(function() {
			var pageId = $(this).attr('data-value');
			var pageLabel = $(this).text()
			var docId = $(this).attr('data-first-page-first-doc');
			arrayPagePairs.push({
				id: pageId,
				label: pageLabel,
				firstDoc: docId
			});
		});
		createBrnav(arrayPagePairs);
	}
}

// Funzione per creare lo slider (gli viene passato l'array a seconda che è stata cliccata un tipo di modalità)
function createBrnav(array) {
	//alert(array);
	var hashPart = location.hash;
	if (hashPart == "") {
		//alert("Siamo nell'index");
		var pageNum = array && array.length > 0 ? array[0].label + "/" + array[array.length - 1].label : '';
	} else {
		//alert(location.hash);
		hashPart = location.hash.substr(1).split('&'); // Parto dal carattere in posizione 1 e tolgo il carattere &
		for (var i = 0; i < hashPart.length; i++) {
			if (hashPart[i].indexOf("page") != -1) {
				var temp_id = hashPart[i].substr(5); // Prendo l'id
				//alert("temp_pp e': " + temp_id); // Ad esempio fol_215v o fol_215v+fol_216r
			}
		}
		for (i in array) { // Scorro l'array
			//alert(array[i].id);
			var elem = array[i].id; // Memorizzo l'elemento id in posizione i
			if (elem.indexOf(temp_id) != -1) { // Controllo se esiste una sequenza uguale a temp_id (se non è null)
				var pageNum = array && array.length > 0 ? array[i].label + "/" + array[array.length - 1].label : ''; // Il pagenum prende il valore di label di indice selezionato
				//$("#BRpager").slider("value", i);
				//alert(i);
				if ($('.current_mode').attr('id') === 'imgd_link') { // Se è stata cliccata la modalità bookreader
					if (i != array.length - 1) { // Se i è diverso da array.length-1 (cioè se siamo su tutte le pagine tranne l'ultima)
						$('#BRpager').slider({ // Modifico lo slider e il valore prende l'elemento in indice i
							min: 0,
							max: array.length - 1,
							value: i
						});
						var newPage = array[i];
						//alert(newPage);
						var newPageId = newPage ? newPage.id : '';
						var newPageLabel = newPage ? newPage.label : '';
						var newDocId = newPage ? newPage.firstDoc : '';
						if (newPage) { // Check just to be sure
							updateHash(newDocId, newPageId, '');
						}
					} else { // Altrimenti (cioè se siamo sull'ultima pagina)
						$('#BRpager').slider({ // Il valore dello slider và sull'ultima pagina
							min: 0,
							max: array.length - 1,
							value: i
						});
						var newPage = array[i];
						//alert(newPage);
						var newPageId = newPage ? newPage.id : '';
						var newPageLabel = newPage ? newPage.label : '';
						var newDocId = newPage ? newPage.firstDoc : '';
						if (newPage) { // Check just to be sure
							updateHash(newDocId, newPageId, '');
						}
					}
				}
				if ($('.current_mode').attr('id') === 'txtimg_link') { // Se siamo nella modalità immagine-testo
					//alert(i);
					if (i != array.length - 1) { // Se i è diverso da array.length-1 (cioè dall'ultima pagina)
						$('#BRpager').slider({ // Il valore dello slider prende quello di i
							min: 0,
							max: array.length - 1,
							value: i
						});
						var newPage = array[i];
						//alert(newPage);
						var newPageId = newPage ? newPage.id : '';
						var newPageLabel = newPage ? newPage.label : '';
						var newDocId = newPage ? newPage.firstDoc : '';
						if (newPage) { // Check just to be sure
							updateHash(newDocId, newPageId, '');
						}
					}
				} else { // Altrimenti (cioè se siamo sull'ultima pagina)
					$('#BRpager').slider({ // Lo slider prende il valore dell'ultima pagina
						min: 0,
						max: array.length - 1,
						value: i
					});
					var newPage = array[i];
					//alert(newPage);
					var newPageId = newPage ? newPage.id : '';
					var newPageLabel = newPage ? newPage.label : '';
					var newDocId = newPage ? newPage.firstDoc : '';
					if (newPage) { // Check just to be sure
						updateHash(newDocId, newPageId, '');
					}
				}
			}
		}
	}

	//var pageNum = array && array.length > 0 ? array[0].label + "/" + array[array.length - 1].label : '';
	$("#pagenum").text(pageNum); // Mostra il numero della pagina sul totale della pagine
	$('#BRpager').slider({
		min: 0,
		max: array.length - 1,
		/*slide: function(event, ui) {  // E' lanciato durante il trascinamento del cursore
			$("#pagenum").text(array[ui.value] + "/" + array[array.length-1]);
		},*/
		change: function(event, ui) {
			var newPage = array[ui.value]; // Elemento dell'array di indice ui.value (sarà quello su cui si sposta lo slider)
			var newPageId = newPage ? newPage.id : '';
			var newPageLabel = newPage ? newPage.label : '';
			var newDocId = newPage ? newPage.firstDoc : '';
			if (event && event.handleObj && newPageId) { // Aggiorno hash solo se sto muovendo lo slider direttamente 
				updateHash(newDocId, newPageId, '');
			}
			var pageNum = array && array.length > 0 ? newPageLabel + "/" + array[array.length - 1].label : '';
			$("#pagenum").text(pageNum);
		}
	});

	bindViscollClick(array);
}

function bindArrowsBRnavClick() {
	// Pulsante per ridurre la barra di navigazione
	var BRnav = $('#BRnav'),
		BRnavCntl = $('.BRnavCntl'),
		centralWrapper = $('#central_wrapper');
	BRnavCntl
		.unbind("click")
		.click(function() {
			if (BRnav.hasClass('collapsed')) {
				// Expand
				BRnav.removeClass('collapsed').addClass('expanded');
				centralWrapper.removeClass('navBarCollapsed').addClass('navBarExpanded');
				$(this).removeClass('BRup').addClass('BRdown');
				$(this).find('.fa').removeClass('fa-caret-up').addClass('fa-caret-down');
			} else {
				// Collapse
				BRnav.removeClass('expanded').addClass('collapsed');
				centralWrapper.removeClass('navBarExpanded').addClass('navBarCollapsed');
				$(this).removeClass('BRdown').addClass('BRup');
				$(this).find('.fa').removeClass('fa-caret-down').addClass('fa-caret-up');
			}
			updateTextContHeight();
		}
	);
}