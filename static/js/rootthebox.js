//colors
var red= "#F04424";
var blue= "#6BBCE9";
var green= "#97C93D";
var yellow= "#E8C22B";
var lightgray= "#8A8A8A";
var darkgray= "#5c5c5c";



function createLine(x1,y1, x2,y2, color, prefix){
    var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  var transform = 'rotate('+angle+'deg)';

    var line = $('<div>')
        .prependTo('.'+prefix+'-'+color)
        .addClass('line')
        .css({
          //'position': 'absolute',
          'transform': transform
        })
        .width(length)
        .offset({left: x1, top: y1});

    //return line;
}



function makeLines(color, prefix){
if ($.browser.msie){
	return;
}
	var TRcorner = [$("."+prefix+"-"+color).offset().left+$("."+prefix+"-"+color).outerWidth(false)-2, $("."+prefix+"-"+color).offset().top-1];
	var BRcorner = [$("."+prefix+"-"+color).offset().left+$("."+prefix+"-"+color).outerWidth(false)-2, $("."+prefix+"-"+color).offset().top+$("."+prefix+"-"+color).height()+1];
	var TLcorner = [$("."+prefix+"-"+color).offset().left, $("."+prefix+"-"+color).offset().top];
	var BLcorner = [$("."+prefix+"-"+color).offset().left, $("."+prefix+"-"+color).offset().top+$("."+prefix+"-"+color).height()+1];
	
	if (prefix=='menu'){
		var vertPoint = [$('.vert-'+color).offset().left, $('.vert-'+color).offset().top];//[$(window).width()/2, BRcorner[1] + 40];
	} else {
		var vertPoint = [$('.vert-'+color).offset().left, BRcorner[1]+40];//[$(window).width()/2, BRcorner[1] + 40];

	}
	
	if (Math.abs(vertPoint[0]-BLcorner[0]) < Math.abs(vertPoint[0]-BRcorner[0])){ //connect vertical line to Left Corners
	
		
		var leftMarg = $("."+prefix+"-"+color).css('margin-left').replace(/[^-\d\.]/g, '');
		
		//top line
		createLine(TLcorner[0], TLcorner[1], vertPoint[0]-1, vertPoint[1]-1, color, prefix);
		
		//bottom line
		createLine(BLcorner[0], BLcorner[1], vertPoint[0]-1, vertPoint[1]-1, color, prefix);
		if ($.browser.mozilla){ //Mozilla fix
		
			$("."+prefix+"-"+color+' div.line').css('left',-1);
		}

	} else { //connect vertical line to Right Corners
	
		//top line
		createLine(TRcorner[0], TRcorner[1], vertPoint[0], vertPoint[1], color, prefix);
		
		//bottom line
		createLine(BRcorner[0], BRcorner[1], vertPoint[0], vertPoint[1], color, prefix);
		
		if (TRcorner[0] - vertPoint[0] > 0 && $.browser.mozilla){
			var currentLeft = $("."+prefix+"-"+color+" div.line").css('left').replace(/[^-\d\.]/g, '');
			var newLeft = currentLeft - (TRcorner[0]-vertPoint[0]);
			$("."+prefix+"-"+color+" div.line").css('left', newLeft);
		}
	}
	
}
function lines(){
	makeLines('red', 'menu');
	makeLines('blue', 'menu');
	makeLines('yellow', 'menu');
	makeLines('green', 'menu');
	
	makeLines('red', 'sec-title');
	makeLines('yellow', 'sec-title');
	makeLines('blue', 'sec-title');
	makeLines('green', 'sec-title');
}
function refreshLines(){
	$("div.line").remove();
	lines();
}

lines();

$(window).resize(function() {
	refreshLines();
});

/*---------- MAIN MENU NAVIGATION ----------*/



$('.main-menu a, .small-menu a, .vert-lines a, .site-map a').click(function(e){
	e.preventDefault();
	if ($(this).attr('href') == "#registration"){
	var pos = $("#registration").offset().top - ($(window).height() - $("#registration").height());
		$.scrollTo(pos, 500, {easing:'easeInOutSine'});	
	} else {
		var dist = Math.abs($($(this).attr("href")).offset().top - $(window).scrollTop());
		var pps = 1500; //pixels per second
		var time = (dist/pps)*1000;
		$.scrollTo($(this).attr("href"), time, {easing:'easeOutQuint', offset:-25});
	}
});

/*---------- MAIN MENU BOTTOM MARGIN ---------------*/


function mmBottomMargin(){
		if ($(window).height() - $(".main-menu").offset().top - $(".main-menu").height() > 80){
			$(".main-menu").css("margin-bottom", $(window).height() - ($(".main-menu").offset().top+$(".main-menu").height()));
		} else {
			$(".main-menu").css("margin-bottom", "80px");
		}
		/*
		//console.log($(".main-menu").css("margin-bottom").replace(/[^-\d\.]/g, ''));
		if ($(".main-menu").css("margin-bottom").replace(/[^-\d\.]/g, '') < 40){
		console.log($(".main-menu").css("margin-bottom").replace(/[^-\d\.]/g, ''));
			$(".main-menu").css("margin-bottom", '40px');
			console.log($(".main-menu").css("margin-bottom"));
		}*/
}
$(window).resize(function(){
	mmBottomMargin();
});
mmBottomMargin();
/*---------- VERTICAL LINES OPACITY SHIFT ----------*/
$(window).scroll(function(){
	mmBottomMargin()

	$('.vert-lines .vert-inner .vert-wrap > a').each(function(index){
		var color = $(this).attr("class").split("-");
		color = color[1];
		var target = $(".sec-"+color);
		var scrollPosition = $(window).scrollTop();
		var windowSize = $(window).height();
		var top = target.offset().top;
		var bottom = top+target.height();
		var nextTarget;
		if (color!='green'){
			nextTarget = target.next('section');
		} else {
			nextTarget = $("footer");
		}
		var distance ;//= 0;
		var furthest;//= 1;
		var trigger; // the trigger is the point at which a fade will start
		var triggerNum; //debug
		
		//TRIGGER ASSIGN
		if (scrollPosition<top){ // we haven't passed the top of the section yet - Fade In
		
			trigger = target.offset().top - $(window).height();
			
			if (target.prev('section').length){
				if (trigger < target.prev('section').offset().top){
					trigger = target.prev('section').offset().top;
				}
			}
			
			triggerNum=1;
			//distance = 0;
			//furthest = 0;
			
		} else { // we've passed the top of the section - Fade Out
			if (target.height() > windowSize){ // adjusts for small sections
				trigger = nextTarget.offset().top - windowSize; // the trigger is 1 window height before the top of the next section
				console.log("HEY TRIGGER: "+trigger+" nextTarget: "+index+"      scrolltop: "+scrollPosition);
			} else {
				trigger = top;
			}
			triggerNum=2;
		}
		

		
		//FADE
		if (scrollPosition<top){ // we haven't passed the top of the section yet - Fade In
			if ($(window).scrollTop() >= trigger && color != 'red'){
				distance = scrollPosition - top;
				furthest = trigger - top;
			}
		} else { // we've passed the top of the section - Fade Out
			if (scrollPosition >= trigger){
				distance = scrollPosition-trigger;
				furthest = bottom-trigger;
			}
		}
		
		//OVERRIDE FOR TOP SPLASH AREA
		if (scrollPosition < ($('body section').eq(0).offset().top-windowSize)){ //scroll bottom is above first section
			distance=0;
			furthest=1;
		} else if(scrollPosition < $('body section').eq(0).offset().top){ //scroll top is above first section
		//console.log('target.attr("class") = '+ target.attr("class")+"      $('body section').eq(0).attr('class')"+$('body section').eq(0).attr("class")); 
			if (target.attr("class") == $('body section').eq(0).attr("class")){
			console.log("its true");
				distance=0;
				furthest=1;
			} else {
				trigger = $('body section').eq(0).offset().top-windowSize;
				distance = scrollPosition - trigger;
				furthest = $("#registration").offset().top - ($(window).height() - $("#registration").height()) - trigger;
			}
		}
		
		/*$("#"+color+"-line-debug").remove();
		
		$('body').append("<div id='"+color+"-line-debug' style='position: absolute; height:1px; background:"+color+"; width:100%; top:"+trigger+"px'><div style='color: "+color+"; margin-left: "+Math.random()*100+"px'>"+triggerNum+"</div></div>");		
		
		*/
		
		
		var value = 1-(distance/furthest);
		
		if (value<.25){
			value = .25;
		}

		$(this).css("opacity", value);
		$('.main-menu .menu-'+color).css("opacity", value);
	});	
});


/*---------- GOOGLE MAPS OBJECT ----------*/
var myLatlng = new google.maps.LatLng(33.30801, -111.84248);

var mapOptions = {
  center: myLatlng,
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl:false,
  streetViewControl:false,
  scrollwheel:false
};


function initialize(){
var map = new google.maps.Map(document.getElementById("map_canvas"),
    mapOptions);
    
var marker = new google.maps.Marker({
  position: myLatlng,
  map: map,
  title:"Root The Box IX",
});
 
google.maps.event.addListener(marker, 'click', function(){
	window.open($(".mapText").find('a').attr('href'));
});
    }