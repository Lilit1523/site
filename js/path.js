(function () {
   $.path = {};

   /*Functions rotate, scale, add, minus*/
   var func = {
      rotate: function(p, degrees) {
         var radians = degrees * Math.PI / 180,
           c = Math.cos(radians),
           s = Math.sin(radians);
         return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
      },
      scale: function(p, n) {
         return [n*p[0], n*p[1]];
      },
      add: function(a, b) {
         return [a[0]+b[0], a[1]+b[1]];
      },
      minus: function(a, b) {
         return [a[0]-b[0], a[1]-b[1]];
      }
   };

   /*Bezier Curves*/
   $.path.bezier = function( params, rotate ) {
      params.start = $.extend( {angle: 0, length: 0.3}, params.start );
      params.end = $.extend( {angle: 0, length: 0.3}, params.end );

      this.p1 = [params.start.x, params.start.y];
      this.p4 = [params.end.x, params.end.y];

      var v14 = func.minus( this.p4, this.p1 ),
          v12 = func.scale( v14, params.start.length ),
          v41 = func.scale( v14, -1 ),
          v43 = func.scale( v41, params.end.length );

      v12 = func.rotate( v12, params.start.angle );
      this.p2 = func.add( this.p1, v12 );

      v43 = func.rotate(v43, params.end.angle );
      this.p3 = func.add( this.p4, v43 );

      this.f1 = function(t) { return (t*t*t); };
      this.f2 = function(t) { return (3*t*t*(1-t)); };
      this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
      this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

      this.css = function(p) {
         var f1 = this.f1(p), 
             f2 = this.f2(p), 
             f3 = this.f3(p), 
             f4 = this.f4(p), 
             css = {};
         if (rotate) {
            css.prevX = this.x;
            css.prevY = this.y;
         }
         css.x = this.x = ( this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4 );
         css.y = this.y = ( this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4 );
         css.left = css.x + "px";
         css.top = css.y + "px";
         return css;
      };
   };

   $.fx.step.path = function(fx) {
      var css = fx.end.css( 1 - fx.pos );
      if ( css.prevX != null ) {
         $.cssHooks.transform.set( fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")" );
      }
      fx.elem.style.top = css.top;
      fx.elem.style.left = css.left;
   };
})();
