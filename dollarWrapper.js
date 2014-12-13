function DollarWrapper(_renderer){
	var points = new Array();
	var sprites= [];
	var dollar = new DollarRecognizer();
	var isDown = false;
	var renderer=_renderer;
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.autoClear = false;
	var cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
	cameraOrtho.position.z = 10;
	var sceneOrtho = new THREE.Scene();
	this.printGesture=false;
this.render=function(){
	renderer.render( sceneOrtho, cameraOrtho );
}
function addSprite(x,y){
var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {color:'yellow'} ) );
				sprite.scale.set( 10, 10, 1 );
				sprite.position.set( x, y, 1 );
				sceneOrtho.add( sprite );
	sprites[sprites.length]=sprite;
}
function clearSprites(){
	for (var i = sprites.length - 1; i >= 0; i--) {
		sceneOrtho.remove(sprites[i]);
	};
	sprites=[];
}
this.mouseDownEvent=function(x, y)
{
	isDown = true;
	points[0] = new Point(x, y);
	x-=width/2;
	y=height/2-y;
	
	points.length = 1; // clear
	
	addSprite(x,y);
}
this.mouseMoveEvent=function(x, y)
{
	if (isDown)
	{
		points[points.length] = new Point(x, y);// append
		x-=width/2;
		y=height/2-y;
		addSprite(x,y);
	}
}
this.mouseUpEvent=function(x, y)
{
	if (isDown)
	{
		isDown = false;
		if (points.length >= 10)
		{
			var result = dollar.Recognize(points,false);
			$.notify("Result: " + result.Name + " (" + round(result.Score,2) + ").");
			if(this.printGesture){
				var s="new Unistroke(name,new Array(";
				for (var i = 0; i <points.length; i+=3) {
					s+="new Point("+Math.floor(points[i].X)+","+Math.floor(points[i].Y)+"),";
				};
				s+="));"
				$.notify(s,{autoHide:false,clickToHide:false});
			}
		}
		else // fewer than 10 points were inputted
		{
			$.notify("Too few points made. Please try again.");
		}
		points=[];
		clearSprites();
	}
}
function round(n, d) // round 'n' to 'd' decimals
{
	d = Math.pow(10, d);
	return Math.round(n * d) / d
}

}