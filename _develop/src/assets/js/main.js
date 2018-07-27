import p5 from 'p5';
var css=require("../css/style.styl");
var point=[];
const app = p => {
  var img;
	p.setup = () => {
    var canvas=p.createCanvas(800,800);
    canvas.parent('scene_1');
    for(var i=0;i<50;i++){
    point[i]= new pacticle(p,400,400,point);
  }
	};
	p.draw = () => {
		p.background(79,196,255);
      for(var i=0;i<50;i++){
    point[i].update();
  }
	};
};

new p5(app);
// //-----------------------------------------------------//
class pacticle{
  constructor(p,x,y,point){
    this.p=p;
    this.position= new p5.Vector(400,400);
    this.acceleration= new p5.Vector(0,0);
    this.velocity= new p5.Vector(0,0);
    this.angle=0;
    this.color=255-Math.random()*35
    this.update();
  }
  run(){
    this.velocity=this.velocity.add(this.acceleration);
    this.position=this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  update(){
    var theta = this.velocity.heading() + Math.PI/2;
    this.wander();
    this.separation(point);
    this.allignment(point);
    this.checkWall();
    this.run();
    // this.p.image(this.img,this.position.x,this.position.y);
    this.p.push();
    this.p.fill(255,138,79);
    this.p.translate(this.position.x,this.position.y);
    this.p.rotate(theta);
    this.p.beginShape();
    this.p.vertex(0, -6);
    this.p.vertex(-5, 6);
    this.p.vertex(-1, 10);
    this.p.vertex(-4, 14);
    this.p.vertex(4, 14);
    this.p.vertex(1, 10);
    this.p.vertex(5, 6);
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }
  checkWall(){
    if(this.position.x<30||this.position.x>770){
      this.acceleration.x=this.acceleration.x*-2;
      this.acceleration.y=this.acceleration.y;
    }
    if(this.position.y<30||this.position.y>770){
      this.acceleration.x=this.acceleration.x;
      this.acceleration.y=this.acceleration.y*-2;
    }
  }
  wander(){
    var refVel=this.velocity;
    refVel.normalize();
    var refLoc= new p5.Vector(this.position.x + refVel.x*60,this.position.y + refVel.y*60);
    var target= new p5.Vector(refLoc.x+ Math.sin(this.angle)*30,refLoc.y+ Math.cos(this.angle)*30);
    if(this.angle>1000){
      this.angle=0;
    }else {
      this.angle+=Math.random()*0.5-Math.random()*0.8;
    }
    var desire= new p5.Vector(0,0);
    desire=p5.Vector.sub(target,this.position);
    desire.normalize();
    desire.mult(5);
    var steer= new p5.Vector(0,0);
    steer=p5.Vector.sub(desire,this.velocity);
    steer.limit(0.1);
    this.acceleration.add(steer);
  }
  cohesion(){

  }
  allignment(point){
    var distance=30;
    var sum= new p5.Vector(0,0);
    var count=0;
    for(var i=0;i<point.length;i++){
      var d=p5.Vector.dist(this.position,point[i].position);
      if(d>0&&d<distance){
        sum.add(point[i].velocity);
        count++;
      }
    }
    if(count>0){
      sum.div(count);
      sum.normalize();
      sum.mult(5);
      var steer= new p5.Vector(0,0);
      steer= p5.Vector.sub(sum,this.velocity);
      steer.limit(0.1);
      this.acceleration.add(steer);
    }
  }
  separation(point){
    var distance=25;
    var steer= new p5.Vector(0,0);
    var count=0;
    for(var i=0;i<point.length;i++){
      var d= p5.Vector.dist(this.position,point[i].position);
      if(d>0&&d<distance){
        var diff= p5.Vector.sub(this.position,point[i].position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if(count>0){
      steer.div(count);
    }
    if(steer.mag()>0){
      steer.normalize();
      steer.mult(5);
      steer.sub(this.velocity);
      steer.limit(0.5);
      this.acceleration.add(steer);
    }
  }
}