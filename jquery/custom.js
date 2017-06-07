var mouseX = -1;
var mouseY = -1;
var selected_color;
var ctx;
var scale = 20;
var backgroundColor = 'white';
var dictionary = {};
var defaultswatch = [
	'rgb(255, 255, 255)'	,
	'rgb(228, 228, 228)'	,
	'rgb(136, 136, 136)'	,
	'rgb(34, 34, 34)'	,
	'rgb(255, 167, 209)'	,
	'rgb(229, 0, 0)'		,
	'rgb(229, 149, 0)'	,
	'rgb(160, 106, 66)'	,
	'rgb(229, 217, 0)'	,
	'rgb(148, 224, 68)'	,
	'rgb(2, 190, 1)'		,
	'rgb(0, 211, 221)'	,
	'rgb(0, 131, 199)'	,
	'rgb(0, 0, 234)'		,
	'rgb(207, 110, 228)'	,
	'rgb(130, 0, 128)'
];
var mousedown = false;

var wrapperheight = 0;
var overlay = 0;
var paleft = 0;

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.toolbarheight) {
            wrapperheight = properties.toolbarheight.value;
            $('#wrapper').css('height', 53 + wrapperheight + 'px');
        }
		
        if (properties.backcolor) {
            var color = properties.backcolor.value.split(' ');
            color = color.map(function(c) {
                return Math.ceil(c * 255);
            });
            backgroundColor = 'rgb(' + color + ')';
            $('canvas').css('background-color', backgroundColor);
        }
		
        if (properties.pixelscale) {
            scale = properties.pixelscale.value;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			loadPixels();
        }
		
        if (properties.paletteleft) {
			$('#arrow').css('left', '-50px');
			selected_color = null;
			paleft = properties.paletteleft.value;
			var x = paleft / 100 * (parseInt($('#wrapper').css('width')) - parseInt($('#rightbar').css('width')) - parseInt($('#middlebar').css('width')));
			$('#middlebar').css('left',x);
        }
        
        if (properties.overlay) {
            switch(properties.overlay.value) {
                case 0:
                    $('#overlay').css('background-image', 'url()');
                    break;
                case 1:
                    $('#overlay').css('background-image', 'url(resources/grain/arches.png)');
                    break;
                case 2:
                    $('#overlay').css('background-image', 'url(resources/grain/cross-stripes.png)');
                    break;
                case 3:
                    $('#overlay').css('background-image', 'url(resources/grain/first-aid-kit.png)');
                    break;
                case 4:
                    $('#overlay').css('background-image', 'url(resources/grain/grunge-wall.png)');
                    break;
                case 5:
                    $('#overlay').css('background-image', 'url(resources/grain/handmade-paper.png)');
                    break;
                case 6:
                    $('#overlay').css('background-image', 'url(resources/grain/old-mathematics.png)');
                    break;
                case 7:
                    $('#overlay').css('background-image', 'url(resources/grain/paper.png)');
                    break;
                case 8:
                    $('#overlay').css('background-image', 'url(resources/grain/pixel.png)');
                    break;
                case 9:
                    $('#overlay').css('background-image', 'url(resources/grain/soft-wallpaper.png)');
                    break;
            }
        }
    }
};

function createPixel(x,y,color) {
	drawPixel(x,y,color,ctx);
    dictionary[x + ' ' + y] = {'x': x, 'y': y, 'color': color};
    localStorage.setItem('Pixelfield', JSON.stringify(dictionary));
}
			
function drawPixel(x,y,color,graphics2D) {
	graphics2D.fillStyle = color;
	graphics2D.fillRect(x * scale,y * scale,scale,scale);
}

function initCanvas() { 
	var canvas = document.getElementById('pixelfield');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		ctx.canvas.width  = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		$('#pixelfield').css('background-color', backgroundColor);
    }
	
	
}

function loadPixels() {
	if (typeof(Storage) !== 'undefined') {
        if (localStorage.getItem('Pixelfield') != null) {
            dictionary = JSON.parse(localStorage.getItem('Pixelfield'));
            for (var property in dictionary) {
                if (dictionary.hasOwnProperty(property)) {
                    var pixel = dictionary[property];
                    drawPixel(pixel.x,pixel.y,pixel.color,ctx);
                }
            }
        }
	} else {
		alert('no local storage support');
	}
}


function initPopup() {
	var $default = $('<div class="palette"></div>');
	$('#popup').prepend($default);
	for (var i = 0; i < defaultswatch.length; i++) {
		$($default).append('<div class="block" style="background-color: ' + defaultswatch[i] + ';" ></div>');
	}
    $($default).prepend('<div class="smallbutton largeconfirmpalette"></div>');
}

function loadPalettes() {
    var local = localStorage.getItem('CurrentPalette');
    if (local != null && local != 'null' && local != 'undefined') {
        $('#swatches').html(localStorage.getItem('CurrentPalette'));
    }
    local = localStorage.getItem('Palettes');
    if (local != null) {
        $('#popup').html(local);
    }
}

$(document).ready(function() {
    //localStorage.clear();
	initCanvas();
	loadPixels();
	loadPalettes();
    
    $('.newcolor').spectrum({
        color: 'grey',
        change: function(color) {
            $(this).before('<div class="block" style=background-color:' + color.toHexString() + '; ><div class="deletecolor"></div></div>');
            localStorage.setItem('Palettes', $('#popup').html());
            
            $('.deletecolor').click(function() {
                $(this).parent().remove();
                localStorage.setItem('Palettes', $('#popup').html());
            });
        }
    });
    
    $('#createpalette').click(function() {
        var $elpal = $('<div class="palette">' +  
                    '<div class="smallbutton confirmpalette"></div>' +
                    '<div class="smallbutton deletepalette"></div>' +
                    '</div>');
        $(this).before($elpal);
        
        var $elncol = $('<div class="newcolor block-none"></div>');
        $($elpal).append($elncol);
        
        localStorage.setItem('Palettes', $('#popup').html());
        
        $($elncol).spectrum({
            color: 'grey',
            change: function(color) {
                $(this).before('<div class="block" style=background-color:' + color.toHexString() + '; ><div class="deletecolor"></div></div>');
                localStorage.setItem('Palettes', $('#popup').html());

                $('.deletecolor').click(function() {
                    $(this).parent().remove();
                    localStorage.setItem('Palettes', $('#popup').html());
                });
            }
        });
    });
	
    $('#blackout').on('click', function(e) {
  		if (e.target !== this)
    		return;	
		$(this).fadeOut(200);
		
    });
	
    $('#none').click(function() {
		selected_color = null;
		$(this).css({'transform':'scale(1.1)'});
		$('#arrow').animate({left: '-50px'},200);
    });
    
    $('#palettes').click(function() {
        var left = $('#middlebar').offset().left;
        var min = parseInt($('#popup').css('min-width'));
        if (parseInt($('#middlebar').css('width')) < min)
            $('#popup').css('left', left - (min-parseInt($('#middlebar').css('width')))/2 );
        else
            $('#popup').css('left', left);
        $('#popup').css('width', $('#middlebar').css('width'));
		$('#blackout').fadeIn(200);
    });
	
    $('#palettes').hover(function() {
        $(this).animate({'top': '1px'},200);
    },function() {
        $(this).animate({'top': '7px'},200);
    });
    
    $('#save').click(function() {
        var name = prompt('Enter name of background','Background1');
        if (name == null) return;
        var dictionaries = JSON.parse(localStorage.getItem('Saves'));
        if (dictionaries == null)
            dictionaries = {};
        if (dictionaries.hasOwnProperty(name))
            if(!confirm('Entry already exists. Erase?'))
                return;
        dictionaries[name] = dictionary;
        localStorage.setItem('Saves', JSON.stringify(dictionaries));
    });
    
    $('#open').click(function() {
        $('#savebar').empty();
        
        var dictionaries = JSON.parse(localStorage.getItem('Saves'));
        if (dictionaries != null) {
            for (var property in dictionaries) 
                if (dictionaries.hasOwnProperty(property)) {
                    $('#savebar').append('<div class="previewbox" id="' + property + 
                                         '"><div class="deletesave"></div><canvas id="' + property + 
                                         '_canvas" class="previewcanvas"></canvas><div class="previewsubtitle">' + property + 
                                         '</div> </div>');
                    
                    var canvas_temp = document.getElementById(property + '_canvas');
                    if (canvas_temp.getContext) {
                        var ctx_temp = canvas_temp.getContext('2d');
                        ctx_temp.canvas.width  = window.innerWidth;
                        ctx_temp.canvas.height = window.innerHeight;
                        var dictionary_temp = dictionaries[property];
                        for (var property2 in dictionary_temp) {
                            if (dictionary_temp.hasOwnProperty(property2)) {
                                var pixel = dictionary_temp[property2];
                                drawPixel(pixel.x,pixel.y,pixel.color,ctx_temp);
                            }
                        }
                    }
                }
        }
        
        $('#savebar').animate({bottom: $('#wrapper').height() + 'px'}, 600);
        
    });
    
    $('#savebar').mouseleave(function() {
        $('#savebar').animate({bottom: '-' + $('#savebar').height() + 'px'}, 600);
    });
    
    $('#savebar').on('click', '.deletesave', function(e) {
        if (!confirm('Delete save?')) 
            return false;
        var dictionaries = JSON.parse(localStorage.getItem('Saves'));
        delete dictionaries[$(this).parent().attr('id')];
        localStorage.setItem('Saves', JSON.stringify(dictionaries));
        $(this).parent().remove();
        return false;
    });
    
    $('#savebar').on('click', '.previewbox', function(e) {
        $(this).css({'transform':'scale(1.1)'});
		if (!confirm('This will replace all pixels without saving. Continue?')) 
            return;
        var id = this.id;
        var dictionaries = JSON.parse(localStorage.getItem('Saves'));
        dictionary = dictionaries[id];
        localStorage.setItem('Pixelfield', JSON.stringify(dictionary));
        initCanvas();
        loadPixels();
    });
    
    $('#savebar').on('mouseenter', '.previewbox', function() {
        $(this).css({'z-index':'10', 'transform':'scale(1.2)', 'box-shadow': '0 0 10px 0px rgba(0,0,0,0.3)'});
    });
    
    $('#savebar').on('mouseleave', '.previewbox', function() {
        $(this).css({'z-index':'1', 'transform':'scale(1.0)', 'box-shadow': '0 0 7px 0px rgba(0,0,0,0.3)'});
    });
    
    $('#clear').click(function() {
		if (confirm('This will erase all pixels without saving. Continue?')) {
			dictionary = {};
			localStorage.setItem('Pixelfield', JSON.stringify(dictionary));
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
    });
	
    $('#pixelfield').mousedown(function()	{ mousedown = true; });
    $('#pixelfield').mouseup(function()	{ mousedown = false; });
	
	$('#pixelfield').mousemove(function(e)	{
		if (mousedown && selected_color != null) {
			var x = Math.floor(e.pageX/scale);
			var y = Math.floor(e.pageY/scale);
			createPixel(x,y,selected_color);
		}
	});
    
    $('#more').click(function() {
		$('#about').fadeIn(200);
    });
    
    var open = true;
    $('#hide').click(function() {
        if (open) {
            $('#wrapper').animate({bottom: '-58px' }, 800);
            $('#hide').css('transform', 'rotate(0deg)');
            /*$('#arrow').css('left', '-50px');
            selected_color = null;*/
            open = false;
        } else {
            $('#wrapper').animate({bottom: '0px' }, 800);
            $('#hide').css('transform', 'rotate(180deg)');
            open = true;
        }
        
    });
		
    $('#swatches').on('click', '.swatch', function() {
        selected_color = $(this).css('background-color');
		var x = $(this).offset().left;
		$('#arrow').animate({left: x},200);
    });
    
	$('#popup').on('mouseenter', '.palette', function() {
        $(this).css('background-color', 'whitesmoke');
    });
    
	$('#popup').on('mouseleave', '.palette', function() {
        $(this).css('background-color', 'white');
    });

	$('#popup').on('mouseenter', '.smallbutton', function() {
        $(this).css({'box-shadow': '0 0 3px 0px rgba(0,0,0,0.3)'});
    });
    
	$('#popup').on('mouseleave', '.smallbutton', function() {
        $(this).css({'box-shadow': '0 0 7px 0px rgba(0,0,0,0.3)'});
    });

    $('#popup').on('click', '.confirmpalette, .largeconfirmpalette', function() {
        var $newswatch = $('.block',$(this).parent('div:first')).clone();
        $('#swatches').empty();
        $newswatch.addClass('swatch');
        $newswatch.empty();
        $('#swatches').html($newswatch);
        localStorage.setItem('CurrentPalette', $('#swatches').html());
        	
        $('#arrow').css('left', '-50px');
        selected_color = null;
        var x = paleft / 100 * (parseInt($('#wrapper').css('width')) - parseInt($('#rightbar').css('width')) - parseInt($('#middlebar').css('width')));
        $('#middlebar').css('left',x);
    });
    
    $('#popup').on('click', '.deletepalette', function() {
        $(this).parent().remove();
        localStorage.setItem('Palettes', $('#popup').html());
    });
    
    $('#popup').on('click', '.deletecolor', function() {
        $(this).parent().remove();
        localStorage.setItem('Palettes', $('#popup').html());
    });

	$('body').on('mouseenter', '.block, .block-none', function() {
        $(this).css({'z-index':'10', 'transform':'scale(1.2)'});
        if ($(this).hasClass('block')) {
            $(this).css({'box-shadow': '0 0 10px 0px rgba(0,0,0,0.3)'});
        }
    });
    
	$('body').on('mouseleave', '.block, .block-none', function() {
        $(this).css({'z-index':'0', 'transform':'scale(1)'});
        if ($(this).hasClass('block')) {
            $(this).css({'box-shadow': '0 0 7px 0px rgba(0,0,0,0.3)'});
        }
    });
	
	$('body').on('click', '.block, .block-none', function() {
		$(this).css({'transform':'scale(1.1)'});
	});
        
});